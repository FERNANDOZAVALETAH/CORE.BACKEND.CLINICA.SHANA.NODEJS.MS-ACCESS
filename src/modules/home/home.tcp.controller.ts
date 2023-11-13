import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import * as interfaces from './interfaces';
import * as services from './services';

@Controller()
export class HomeTcpController {
  constructor(
    private readonly fnRegisterConsultingService: services.FnRegisterConsultingService,
    private readonly fnRegisterSessionService: services.FnRegisterSessionService,
  ) {}

  @MessagePattern({
    subjet: 'client-home',
    function: 'register-consulting',
  })
  registerConsulting(payload: interfaces.IRegisterConsulting): Promise<void> {
    return this.fnRegisterConsultingService.execute(payload);
  }

  @MessagePattern({
    subjet: 'client-home',
    function: 'register-session',
  })
  registerSession(payload: interfaces.IRegisterSession[]): Promise<void> {
    return this.fnRegisterSessionService.execute(payload);
  }
}
