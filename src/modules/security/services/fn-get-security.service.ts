import { Logger } from '@nestjs/common';
import { IValidateExistToken } from '../interfaces';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Securities, SecuritiesDocument } from 'src/common/schemas';

export class FnGetSecurityService {
  private logger = new Logger(`::${FnGetSecurityService.name}::`);

  constructor(
    @InjectModel(Securities.name)
    private readonly securityModel: mongoose.Model<SecuritiesDocument>,
  ) {}

  async execute(payload: IValidateExistToken): Promise<boolean> {
    this.logger.debug(`::execute::parameters::${JSON.stringify(payload)}`);
    return !!this.securityModel.count({ tokens: payload.token });
  }
}
