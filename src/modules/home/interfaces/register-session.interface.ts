import * as mongoose from 'mongoose';

export interface IRegisterSession {
  idUser: string;
  idConsulting: string;
  idSession: string;
  consultingNumber: string;
  sessionNumber: string;
  sessionDate: string;
  sessionHour: string;
  dni: string;
  client: string;
  status: number;
}
