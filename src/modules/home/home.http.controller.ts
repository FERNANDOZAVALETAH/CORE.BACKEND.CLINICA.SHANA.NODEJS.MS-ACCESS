import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ResponseGenericDto } from 'src/common/dto';
import {
  GenerateTokenInternalException,
  InvalidCredentialsCustomException,
} from 'src/exception';
import { FnHomeService } from './services';
import { RequiredPermisions, UserDecorator } from 'src/common/decorator';
import { IUserSession } from 'src/common/interfaces';
import { PermisionGuard } from 'src/common/guards/permision.guard';
import { AccessGuard } from 'src/common/guards/access.guard';
import { Permision } from 'src/common/enums';

@ApiBearerAuth()
@UseGuards(AccessGuard, PermisionGuard)
@Controller('home/v1.0')
export class HomeController {
  constructor(private readonly fnHomeService: FnHomeService) {}

  @ApiCreatedResponse({
    description: 'Get home has been successfully created authentication.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'Get home has been failed by conflict authentication',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: InvalidCredentialsCustomException,
  })
  @UseGuards(ThrottlerGuard)
  @RequiredPermisions(Permision.HOME_READ)
  @Throttle()
  @Get('/')
  getHome(
    @UserDecorator() userSession: IUserSession,
  ): Promise<ResponseGenericDto> {
    return this.fnHomeService.execute(userSession);
  }
}
