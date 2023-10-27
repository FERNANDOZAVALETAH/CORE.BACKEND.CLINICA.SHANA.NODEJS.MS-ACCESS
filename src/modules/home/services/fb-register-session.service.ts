import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Home, HomeDocument } from 'src/common/schemas';
import { RegisterHomeSessionInternalException } from 'src/exception';
import { IRegisterSession } from '../interfaces';

@Injectable()
export class FnRegisterSessionService {
  private logger = new Logger(`::${FnRegisterSessionService.name}::`);

  constructor(
    @InjectModel(Home.name)
    private readonly homeModel: mongoose.Model<HomeDocument>,
  ) {}

  async execute(payload: IRegisterSession[]) {
    this.logger.debug(`::execute::parameters::${JSON.stringify(payload)}`);
    try {
      const homeForUser = await this.homeModel.findOne({
        idUser: mongoose.Types.ObjectId(payload[0].idUser),
      });
      await this.update(homeForUser._id, payload);
    } catch (error) {
      this.logger.error(error);
      throw new RegisterHomeSessionInternalException();
    }
  }

  private async update(
    idHome: mongoose.Types.ObjectId,
    iregisterSessions: IRegisterSession[],
  ): Promise<void> {
    await this.homeModel.findOneAndUpdate(
      { _id: idHome },
      {
        $addToSet: { currentWeekSession: { $aech: iregisterSessions } },
      },
    );
  }
}
