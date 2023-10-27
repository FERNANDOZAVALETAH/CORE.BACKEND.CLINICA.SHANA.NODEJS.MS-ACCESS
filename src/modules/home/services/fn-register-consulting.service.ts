import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IRegisterConsulting } from '../interfaces';
import { RegisterHomeConsultingInternalException } from 'src/exception';
import { Home, HomeDocument } from 'src/common/schemas';

@Injectable()
export class FnRegisterConsultingService {
  private logger = new Logger(`::${FnRegisterConsultingService.name}::`);

  constructor(
    @InjectModel(Home.name)
    private readonly homeModel: mongoose.Model<HomeDocument>,
  ) {}

  async execute(payload: IRegisterConsulting): Promise<void> {
    this.logger.debug(`::execute::parameters::${JSON.stringify(payload)}`);
    try {
      const existHomeForUser = await this.homeModel.findOne({
        idUser: mongoose.Types.ObjectId(payload.idUser),
      });
      this.logger.debug(`::execute::existHomeForUser::${!existHomeForUser}`);
      if (!existHomeForUser) {
        await this.create(payload);
      } else {
        await this.update(existHomeForUser._id, payload);
      }
    } catch (error) {
      this.logger.error(error);
      throw new RegisterHomeConsultingInternalException();
    }
  }

  private async create(payload: IRegisterConsulting): Promise<void> {
    await this.homeModel.create({
      idUser: mongoose.Types.ObjectId(payload.idUser),
      countConsulting: {
        canceled: 0,
        rejected: 0,
        attended: 0,
        total: 1,
      },
      currentWeekConsulting: [
        {
          idConsulting: payload.idConsulting,
          consultingNumber: payload.consultingNumber,
          consultingDate: payload.consultingDate,
          consultingHour: payload.consultingHour,
          dni: payload.dni,
          client: payload.client,
          reason: payload.reason,
          status: payload.status,
        },
      ],
    });
  }

  private async update(
    idHome: mongoose.Types.ObjectId,
    payload: IRegisterConsulting,
  ): Promise<void> {
    await this.homeModel.updateOne(
      { _id: idHome },
      {
        $inc: { 'countConsulting.total': 1 },
        $addToSet: {
          currentWeekConsulting: {
            idConsulting: payload.idConsulting,
            consultingNumber: payload.consultingNumber,
            consultingDate: payload.consultingDate,
            consultingHour: payload.consultingHour,
            dni: payload.dni,
            client: payload.client,
            reason: payload.reason,
            status: payload.status,
          },
        },
      },
    );
  }
}
