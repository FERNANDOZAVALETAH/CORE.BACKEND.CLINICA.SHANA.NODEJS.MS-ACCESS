import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { GENERAL } from '../../../const/general.const';

@Injectable()
export class LogService {
  private logger = new Logger(`::${GENERAL.CLIENT.LOGS}::${LogService.name}`);

  constructor(
    @Inject(GENERAL.CLIENT.LOGS)
    private readonly client: ClientTCP,
  ) {}

  callAccessRegister<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    this.logger.debug(
      `execute::callAccessRegister::params${JSON.stringify(dto)}`,
    );
    const pattern = { subjet: 'client-log', function: 'access/register' };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }
}
