import { ConflictException } from '@nestjs/common';

export class InvalidCredentialsCustomException extends ConflictException {
  constructor(originException: string) {
    super(`correo y/o contraseña incorrectos [${originException}]`);
  }
}

export class InvalidTokenCustomException extends ConflictException {
  constructor(tokenException: string, idUserException: string) {
    super(
      `token ingresado es incorrecto [token:${tokenException} idUser:${idUserException}]`,
    );
  }
}
