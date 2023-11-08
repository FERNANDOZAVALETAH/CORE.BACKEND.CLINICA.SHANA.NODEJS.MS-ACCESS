import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ResponseGenericDto } from 'src/common/dto';
import { IUserSession } from 'src/common/interfaces';
import { Home, HomeDocument } from 'src/common/schemas';
import { ResponseHomeDto } from '../dto/response-home.dto';
import { GENERAL } from 'src/const/general.const';
import { getISOWeek, getISOWeekYear } from 'date-fns';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FnHomeService {
  private logger = new Logger(`::${FnHomeService.name}::`);

  constructor(
    @InjectModel(Home.name)
    private readonly homeModel: mongoose.Model<HomeDocument>,
  ) {}

  async execute(iuserSession: IUserSession): Promise<ResponseGenericDto> {
    const { idUser } = iuserSession;
    const {
      countConsulting,
      currentWeekConsulting = [],
      currentWeekSession = [],
    } = (await this.homeModel.findOne({
      idUser: mongoose.Types.ObjectId(idUser),
    })) ?? {};
    const getWeek = this.getCurrentWeekAnsNextWeek();
    return <ResponseGenericDto>{
      message: 'Proceso exitoso',
      operation: `::${FnHomeService.name}::execute`,
      data: <ResponseHomeDto>{
        countConsulting: {
          canceled: !countConsulting ? 0 : countConsulting.canceled,
          rejected: !countConsulting ? 0 : countConsulting.rejected,
          attended: !countConsulting ? 0 : countConsulting.attended,
          total: !countConsulting ? 0 : countConsulting.total,
        },
        currentWeekConsulting: currentWeekConsulting
          .filter(
            (x) =>
              x.status == GENERAL.CONSULTING.STATUS.PENDING &&
              (x.week == getWeek.currentWeek || x.week == getWeek.nextWeek),
          )
          .map((consulting) => {
            return {
              idConsulting: String(consulting.idConsulting),
              dni: consulting.dni,
              client: consulting.client,
              consultingNumber: consulting.consultingNumber,
              consultingDateAndHour: this.getDateAndHour(
                consulting.consultingDate,
                consulting.consultingHour,
              ),
              status: consulting.status,
              reason: consulting.reason,
            };
          }),
        currentWeekSession: currentWeekSession
          .filter((x) => x.status == GENERAL.SESSION.STATUS.PENDING)
          .map((session) => {
            return {
              idConsulting: String(session.idConsulting),
              idSession: String(session.idSession),
              consultingNumber: session.consultingNumber,
              sessionNumber: session.sessionNumber,
              dni: session.dni,
              client: session.client,
              sessionDateAndHour: this.getDateAndHour(
                session.sessionDate,
                session.sessionHour,
              ),
              status: session.status,
            };
          }),
      },
    };
  }

  private getDateAndHour(valueInDate: string, valueInHour: string) {
    return `${valueInDate} ${valueInHour}`;
  }

  private getCurrentWeekAnsNextWeek() {
    const now = new Date();
    const currentWeekNumber = getISOWeek(now);
    const currentYear = getISOWeekYear(now);
    const currentWeek = `${currentYear}${currentWeekNumber}`;
    const nextWeek = `${currentYear}${currentWeekNumber + 1}`;
    return {
      currentWeek,
      nextWeek,
    };
  }
}
