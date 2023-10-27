import { ApiProperty } from '@nestjs/swagger';
import { ResponseLoginDto, ResponseLogoutDto } from '../../modules/auth/dto';
import { ResponseHomeDto } from 'src/modules/home/dto/response-home.dto';

export class ResponseGenericDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  data: ResponseLoginDto | ResponseLogoutDto | ResponseHomeDto;
}
