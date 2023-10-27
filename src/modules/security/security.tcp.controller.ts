import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FnFindUserService, FnGetSecurityService } from './services';
import {
  IFindUser,
  IUser,
  IValidExistPermision,
  IValidateExistToken,
} from './interfaces';
import { FnGetPermisionsService } from './services/fn-get-permisions.service';

@Controller()
export class SecurityTcpController {
  constructor(
    private readonly fnGetSecurityService: FnGetSecurityService,
    private readonly fnGetPermisionSecurity: FnGetPermisionsService,
    private readonly fnFindUserService: FnFindUserService,
  ) {}

  @MessagePattern({
    subjet: 'client-security',
    function: 'validate-exist-token',
  })
  validateToken(payload: IValidateExistToken): Promise<boolean> {
    return this.fnGetSecurityService.execute(payload);
  }

  @MessagePattern({
    subjet: 'client-security',
    function: 'validate-exist-permision',
  })
  validatePermision(payload: IValidExistPermision): Promise<boolean> {
    return this.fnGetPermisionSecurity.execute(payload);
  }

  @MessagePattern({ subjet: 'client-security', function: 'find-user' })
  findUser(payload: IFindUser): Promise<IUser> {
    return this.fnFindUserService.execute(payload);
  }
}
