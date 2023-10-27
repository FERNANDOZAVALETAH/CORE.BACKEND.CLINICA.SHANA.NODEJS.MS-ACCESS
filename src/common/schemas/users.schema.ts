import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../../const/schema.name.const';

export type UsersDocument = Users & mongoose.Document;

@Schema({ collection: SCHEMAS.USERS, autoIndex: true })
export class Users {
  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({ required: true })
  dni: string;

  @Prop({})
  phone: string;

  @Prop({ required: true })
  status: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
