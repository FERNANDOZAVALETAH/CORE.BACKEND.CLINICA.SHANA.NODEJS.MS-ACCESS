import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../../const/schema.name.const';

export type ProfilesDocument = Profiles & mongoose.Document;

@Schema({ collection: SCHEMAS.PROFILES, autoIndex: true })
export class Profiles {
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  idUser: mongoose.Types.ObjectId;

  @Prop({ required: true })
  nickName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop(
    raw({
      type: [],
    }),
  )
  permissions: string[];

  @Prop({ required: true })
  status: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const ProfilesSchema = SchemaFactory.createForClass(Profiles);
