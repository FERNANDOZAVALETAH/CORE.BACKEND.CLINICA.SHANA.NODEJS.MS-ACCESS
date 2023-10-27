import { Logger } from '@nestjs/common';
import { IFindUser, IUser } from '../interfaces';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  Profiles,
  ProfilesDocument,
  Users,
  UsersDocument,
} from 'src/common/schemas';

export class FnFindUserService {
  private logger = new Logger(`::${FnFindUserService.name}::`);

  constructor(
    @InjectModel(Users.name)
    private readonly userModel: mongoose.Model<UsersDocument>,
    @InjectModel(Profiles.name)
    private readonly profileModel: mongoose.Model<ProfilesDocument>,
  ) {}

  async execute(payload: IFindUser): Promise<IUser> {
    this.logger.debug(`::execute::parameters::${JSON.stringify(payload)}`);

    const user = await this.userModel.findById(payload.idUser);
    const profile = await this.profileModel.findOne({
      idUser: mongoose.Types.ObjectId(payload.idUser),
    });
    this.logger.debug(`::execute::user::${JSON.stringify(user)}`);
    return <IUser>{
      idUser: payload.idUser,
      nickName: profile.nickName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: profile.role,
    };
  }
}
