import { Logger } from '@nestjs/common';
import { IValidExistPermision } from '../interfaces';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Profiles, ProfilesDocument } from 'src/common/schemas';

export class FnGetPermisionsService {
  private logger = new Logger(`::${FnGetPermisionsService.name}::`);

  constructor(
    @InjectModel(Profiles.name)
    private readonly profileModel: mongoose.Model<ProfilesDocument>,
  ) {}
  async execute(payload: IValidExistPermision): Promise<boolean> {
    this.logger.debug(`::execute::parameters::${JSON.stringify(payload)}`);
    return !!this.profileModel.count({
      idUser: mongoose.Types.ObjectId(payload.idUser),
      permissions: payload.permision,
    });
  }
}
