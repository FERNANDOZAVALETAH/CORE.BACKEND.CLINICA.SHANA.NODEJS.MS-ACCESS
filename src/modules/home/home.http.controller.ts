import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import * as services from 'src/modules/home/services';
import * as exceptions from 'src/exception';
import * as request from 'src/common/dto';
import * as decorators from 'src/common/decorator';
import * as guards from 'src/common/guards';
import * as permissions from 'src/common/enums';
import * as interfaces from 'src/common/interfaces';

@ApiBearerAuth()
@UseGuards(guards.AccessGuard, guards.PermisionGuard)
@Controller('home/v1.0')
export class HomeController {
  constructor(private readonly fnHomeService: services.FnHomeService) {}

  @ApiCreatedResponse({
    description: 'Get home has been successfully created authentication.',
    type: request.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'Get home has been failed by conflict authentication',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: exceptions.GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: exceptions.InvalidCredentialsCustomException,
  })
  @UseGuards(ThrottlerGuard)
  @decorators.RequiredPermisions(permissions.Permision.HOME_READ)
  @Throttle()
  @Get('/')
  getHome(
    @decorators.UserDecorator() userSession: interfaces.IUserSession,
  ): Promise<request.ResponseGenericDto> {
    return this.fnHomeService.execute(userSession);
  }
}
