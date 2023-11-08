import { Injectable, Logger } from '@nestjs/common';
import { RequestLogoutDto, ResponseLogoutDto } from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Securities, SecuritiesDocument } from '../../../common/schemas';
import { CryptoService } from '../../../common/crypto/crypto.service';
import {
  DeleteTokenInSecurityException,
  FindSecurityTokenException,
  InvalidTokenCustomException,
} from '../../../exception';
import { JwtService } from '@nestjs/jwt';
import { PermisionDeniedUnauthorizedException } from '../../../exception/custom-unauthorized.exception';
import { ResponseGenericDto } from 'src/common/dto';

@Injectable()
export class FnLogoutService {
  private logger = new Logger(`::${FnLogoutService.name}::`);

  constructor(
    @InjectModel(Securities.name)
    private readonly securityModel: mongoose.Model<SecuritiesDocument>,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    requestLogoutDto: RequestLogoutDto,
  ): Promise<ResponseGenericDto> {
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(requestLogoutDto)}`,
    );
    const { idUser, token } = requestLogoutDto;
    const tokenDecrypt = await this.cryptoService.decrypt(token);

    await this.invalidPermisionProcess(tokenDecrypt, requestLogoutDto.idUser);
    const security = await this.findSecurityByIdUserToken(idUser, tokenDecrypt);
    await this.deleteTokenInSecurity(security._id, tokenDecrypt);

    return <ResponseGenericDto>{
      message: 'PE: Proceso exitoso',
      operation: `::${FnLogoutService.name}::execute`,
      data: <ResponseLogoutDto>{
        coment: '',
      },
    };
  }

  private async invalidPermisionProcess(tokenDecrypt: string, idUser: string) {
    const user: any = this.jwtService.decode(tokenDecrypt);
    if (user.idUser != idUser)
      throw new PermisionDeniedUnauthorizedException(``);
  }

  private async findSecurityByIdUserToken(
    idUser: string,
    tokenDecrypt: string,
  ) {
    try {
      const securityByIdUserToken = await this.securityModel.findOne({
        idUser: mongoose.Types.ObjectId(idUser),
        tokens: { $in: [tokenDecrypt] },
      });
      this.logger.debug(
        `::execute::findSecurityByIdUserToken::${JSON.stringify(
          securityByIdUserToken.tokens.length,
        )}`,
      );
      if (!securityByIdUserToken)
        throw new InvalidTokenCustomException(tokenDecrypt, String(idUser));

      return securityByIdUserToken;
    } catch (error) {
      this.logger.error(error);
      throw new FindSecurityTokenException();
    }
  }

  private async deleteTokenInSecurity(
    idSecurity: mongoose.Types.ObjectId,
    token: string,
  ) {
    try {
      await this.securityModel.findByIdAndUpdate(idSecurity, {
        $pull: {
          tokens: [token],
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new DeleteTokenInSecurityException();
    }
  }
}
