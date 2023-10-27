import { InternalServerErrorException } from '@nestjs/common';
import { GENERAL } from '../const/general.const';

export class GenerateTokenInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.GENERATE_TOKEN}`);
  }
}

export class RegisterSecurityInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_SECURITY}`);
  }
}

export class RegisterLogAccessInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_LOG_ACCESS}`);
  }
}

export class RegisterHomeConsultingInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_HOME_CONSULTING}`);
  }
}

export class RegisterHomeSessionInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_HOME_SESSION}`);
  }
}

export class FindSecurityTokenException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.FIND_SECURITY_TOKEN}`);
  }
}

export class DeleteTokenInSecurityException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.DELETE_SECURITY_TOKEN}`);
  }
}
