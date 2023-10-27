import { ApiProperty } from '@nestjs/swagger';

class CountConsultingDto {
  @ApiProperty()
  canceled: number;

  @ApiProperty()
  rejected: number;

  @ApiProperty()
  attended: number;

  @ApiProperty()
  total: number;
}

class CurrentWeekConsultingDto {
  @ApiProperty()
  idConsulting: string;

  @ApiProperty()
  consultingNumber: string;

  @ApiProperty()
  client: string;

  @ApiProperty()
  consultingDateAndHour: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  status: number;
}

class CurrentWeekSessionDto {
  @ApiProperty()
  idConsulting: string;

  @ApiProperty()
  idSession: string;

  @ApiProperty()
  consultingNumber: string;

  @ApiProperty()
  sessionNumber: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  client: string;

  @ApiProperty()
  sessionDateAndHour: string;

  @ApiProperty()
  status: number;
}

export class ResponseHomeDto {
  @ApiProperty({ type: CountConsultingDto, isArray: false })
  countConsulting: CountConsultingDto;

  @ApiProperty({ type: CurrentWeekConsultingDto, isArray: true })
  currentWeekConsulting: Array<CurrentWeekConsultingDto>;

  @ApiProperty({ type: CurrentWeekSessionDto, isArray: true })
  currentWeekSession: Array<CurrentWeekSessionDto>;
}
