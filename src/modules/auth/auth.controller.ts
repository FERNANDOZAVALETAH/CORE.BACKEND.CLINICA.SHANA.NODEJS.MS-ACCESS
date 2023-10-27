import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ResponseLogoutDto,
  ResponseLoginDto,
  RequestLoginDto,
  RequestLogoutDto,
} from '../../modules/auth/dto';

import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ResponseGenericDto } from '../../common/dto';

import {
  GenerateTokenInternalException,
  InvalidCredentialsCustomException,
} from '../../exception';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FnLoginService, FnLogoutService } from './services';

@Controller('auth/v1.0')
export class AuthController {
  constructor(
    private readonly fnLoginService: FnLoginService,
    private readonly fnLogoutService: FnLogoutService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Post('/login')
  @ApiCreatedResponse({
    description: 'The login has been successfully created authentication.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The login has been failed by conflict authentication',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: InvalidCredentialsCustomException,
  })
  login(@Body() requestLodinDto: RequestLoginDto): Promise<ResponseGenericDto> {
    return this.fnLoginService.execute(requestLodinDto);
  }

  @ApiCreatedResponse({
    description: 'The logout has been successfully created.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The logout has been failed by conflict',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: InvalidCredentialsCustomException,
  })
  @Post('/logout')
  logOut(
    @Body() requestLogoutDto: RequestLogoutDto,
  ): Promise<ResponseGenericDto> {
    return this.fnLogoutService.execute(requestLogoutDto);
  }
}
