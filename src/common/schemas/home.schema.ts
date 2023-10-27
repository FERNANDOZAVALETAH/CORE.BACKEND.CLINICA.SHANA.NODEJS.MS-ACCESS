import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../../const/schema.name.const';

export type HomeDocument = Home & mongoose.Document;

@Schema({ collection: SCHEMAS.HOMES, autoIndex: true })
export class Home {
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  idUser: mongoose.Types.ObjectId;

  @Prop(
    raw({
      canceled: Number,
      rejected: Number,
      attended: Number,
      total: Number,
    }),
  )
  countConsulting: Record<string, any>;

  @Prop(
    raw([
      {
        idConsulting: mongoose.Types.ObjectId,
        consultingNumber: String,
        client: String,
        dni: String,
        consultingDate: String,
        consultingHour: String,
        reason: String,
        status: Number,
      },
    ]),
  )
  currentWeekConsulting: Record<string, any>[];

  @Prop(
    raw([
      {
        idConsulting: mongoose.Types.ObjectId,
        idSession: mongoose.Types.ObjectId,
        consultingNumber: String,
        sessionNumber: String,
        client: String,
        dni: String,
        sessionDate: String,
        sessionHour: String,
        status: Number,
      },
    ]),
  )
  currentWeekSession: Record<string, any>[];

  @Prop({ required: true, default: 1 })
  status: number;

  @Prop({ required: true, default: mongoose.now() })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const HomeSchema = SchemaFactory.createForClass(Home);
