import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ResponseGenericDto } from 'src/common/dto';
import { IUserSession } from 'src/common/interfaces';
import { Home, HomeDocument } from 'src/common/schemas';
import { ResponseHomeDto } from '../dto/response-home.dto';

export class FnHomeService {
  constructor(
    @InjectModel(Home.name)
    private readonly homeModel: mongoose.Model<HomeDocument>,
  ) {}

  async execute(iuserSession: IUserSession): Promise<ResponseGenericDto> {
    const { idUser } = iuserSession;
    const { countConsulting, currentWeekConsulting, currentWeekSession } =
      await this.homeModel.findOne({ idUser: mongoose.Types.ObjectId(idUser) });
    return <ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnHomeService.name}::execute`,
      data: <ResponseHomeDto>{
        countConsulting: {
          canceled: countConsulting.canceled,
          rejected: countConsulting.rejected,
          attended: countConsulting.attended,
          total: countConsulting.total,
        },
        currentWeekConsulting: currentWeekConsulting.map((consulting) => {
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
        currentWeekSession: currentWeekSession.map((session) => {
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
}
