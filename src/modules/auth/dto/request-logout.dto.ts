import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RequestLogoutDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  idUser: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
