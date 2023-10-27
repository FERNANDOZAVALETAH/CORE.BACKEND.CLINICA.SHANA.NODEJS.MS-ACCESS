import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IRegisterConsulting, IRegisterSession } from './interfaces';
import {
  FnRegisterConsultingService,
  FnRegisterSessionService,
} from './services';

@Controller()
export class HomeTcpController {
  constructor(
    private readonly fnRegisterConsultingService: FnRegisterConsultingService,
    private readonly fnRegisterSessionService: FnRegisterSessionService,
  ) {}

  @MessagePattern({
    subjet: 'client-home',
    function: 'register-consulting',
  })
  registerConsulting(payload: IRegisterConsulting): Promise<void> {
    return this.fnRegisterConsultingService.execute(payload);
  }

  @MessagePattern({
    subjet: 'client-home',
    function: 'register-session',
  })
  registerSession(payload: IRegisterSession[]): Promise<void> {
    return this.fnRegisterSessionService.execute(payload);
  }
}
