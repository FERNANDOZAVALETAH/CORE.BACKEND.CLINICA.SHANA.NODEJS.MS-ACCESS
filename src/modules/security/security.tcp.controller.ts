import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as services from './services';
import * as interfaces from './interfaces';

@Controller()
export class SecurityTcpController {
  constructor(
    private readonly fnGetSecurityService: services.FnGetSecurityService,
    private readonly fnGetPermisionSecurity: services.FnGetPermisionsService,
    private readonly fnFindUserService: services.FnFindUserService,
  ) {}

  @MessagePattern({
    subjet: 'client-security',
    function: 'validate-exist-token',
  })
  validateToken(payload: interfaces.IValidateExistToken): Promise<boolean> {
    return this.fnGetSecurityService.execute(payload);
  }

  @MessagePattern({
    subjet: 'client-security',
    function: 'validate-exist-permision',
  })
  validatePermision(
    payload: interfaces.IValidExistPermision,
  ): Promise<boolean> {
    return this.fnGetPermisionSecurity.execute(payload);
  }

  @MessagePattern({ subjet: 'client-security', function: 'find-user' })
  findUser(payload: interfaces.IFindUser): Promise<interfaces.IUser> {
    return this.fnFindUserService.execute(payload);
  }
}
