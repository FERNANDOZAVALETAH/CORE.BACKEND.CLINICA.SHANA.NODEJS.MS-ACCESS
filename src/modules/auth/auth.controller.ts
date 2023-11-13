import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import * as request from 'src/modules/auth/dto';
import * as response from 'src/common/dto';
import * as exception from 'src/exception';
import * as services from './services';

@Controller('auth/v1.0')
export class AuthController {
  constructor(
    private readonly fnLoginService: services.FnLoginService,
    private readonly fnLogoutService: services.FnLogoutService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Post('/login')
  @ApiCreatedResponse({
    description: 'The login has been successfully created authentication.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The login has been failed by conflict authentication',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: exception.GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: exception.InvalidCredentialsCustomException,
  })
  login(
    @Body() requestLodinDto: request.RequestLoginDto,
  ): Promise<response.ResponseGenericDto> {
    return this.fnLoginService.execute(requestLodinDto);
  }

  @ApiCreatedResponse({
    description: 'The logout has been successfully created.',
    type: response.ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The logout has been failed by conflict',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: exception.GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: exception.InvalidCredentialsCustomException,
  })
  @Post('/logout')
  logOut(
    @Body() requestLogoutDto: request.RequestLogoutDto,
  ): Promise<response.ResponseGenericDto> {
    return this.fnLogoutService.execute(requestLogoutDto);
  }
}
