import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  Profiles,
  ProfilesDocument,
  Securities,
  SecuritiesDocument,
  Users,
  UsersDocument,
} from '../../../common/schemas';
import { RequestLoginDto, ResponseLoginDto } from '../dto';
import { ResponseGenericDto } from 'src/common/dto';
import {
  GenerateTokenInternalException,
  InvalidCredentialsCustomException,
  RegisterLogAccessInternalException,
  RegisterSecurityInternalException,
} from 'src/exception';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { LogService } from 'src/common/client/log/logs.service';
import { ICreateLogAccess, IGenerateTokenUser } from '../interfaces';
import { GENERAL } from 'src/const/general.const';

@Injectable()
export class FnLoginService {
  private logger = new Logger(`::${FnLoginService.name}::`);

  constructor(
    @InjectModel(Users.name)
    private readonly userModel: mongoose.Model<UsersDocument>,
    @InjectModel(Profiles.name)
    private readonly profileModel: mongoose.Model<ProfilesDocument>,
    @InjectModel(Securities.name)
    private readonly securityModel: mongoose.Model<SecuritiesDocument>,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly logService: LogService,
  ) {}

  async execute(requestLoginDto: RequestLoginDto): Promise<ResponseGenericDto> {
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(requestLoginDto)}`,
    );
    const { email, password } = requestLoginDto;
    const findUserByEmailPassword: ProfilesDocument =
      await this.findUserByEmailPassword(email, password);

    const idUser = String(findUserByEmailPassword.idUser);

    const generateTokenForUser = await this.generateTokenForUser({
      idUser,
      nickName: findUserByEmailPassword.nickName,
      email: findUserByEmailPassword.email,
    });

    await this.registerSecurityForUser(
      idUser,
      generateTokenForUser.tokenDecrypt,
    );

    const icreateLogAccess: ICreateLogAccess = {
      idUser,
      type: GENERAL.ACCESS.LOGIN_CODE,
    };
    this.registerLogAccess(icreateLogAccess);

    return <ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnLoginService.name}::execute`,
      data: <ResponseLoginDto>{
        token: generateTokenForUser.tokenEncrypt,
      },
    };
  }

  private async findUserByEmailPassword(email: string, password: string) {
    const userByEmailAndPassword = await this.profileModel.findOne({
      email,
      password,
    });
    if (!userByEmailAndPassword)
      throw new InvalidCredentialsCustomException(`findUserByEmailPassword`);

    this.logger.debug(`::execute::findUserByEmailPassword::success`);
    return userByEmailAndPassword;
  }

  private async generateTokenForUser(igenerateTokenUser: IGenerateTokenUser) {
    try {
      const token = await this.jwtService.signAsync(igenerateTokenUser);
      const encrypt = await this.cryptoService.encrypt(token);
      return {
        tokenEncrypt: encrypt,
        tokenDecrypt: token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new GenerateTokenInternalException();
    }
  }

  private async registerSecurityForUser(idUser: string, token: string) {
    try {
      const findSecurityByIdUser = await this.securityModel.findOne({
        idUser: mongoose.Types.ObjectId(idUser),
      });
      if (!findSecurityByIdUser) {
        await this.securityModel.create({
          idUser: mongoose.Types.ObjectId(idUser),
          tokens: [token],
        });
      } else {
        await this.securityModel.updateOne(
          { idUser: mongoose.Types.ObjectId(idUser) },
          { $addToSet: { tokens: token } },
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw new RegisterSecurityInternalException();
    }
  }

  private registerLogAccess(icreateLogAccess: ICreateLogAccess): void {
    try {
      this.logService.callAccessRegister(icreateLogAccess);
    } catch (error) {
      this.logger.error(error);
      throw new RegisterLogAccessInternalException();
    }
  }
}
