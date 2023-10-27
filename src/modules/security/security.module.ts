import { Module } from '@nestjs/common';
import {
  FnFindUserService,
  FnGetPermisionsService,
  FnGetSecurityService,
} from './services';
import { SecurityTcpController } from './security.tcp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Profiles,
  ProfilesSchema,
  Securities,
  SecuritiesSchema,
  Users,
  UsersSchema,
} from 'src/common/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Securities.name,
        schema: SecuritiesSchema,
      },
      {
        name: Profiles.name,
        schema: ProfilesSchema,
      },
    ]),
  ],
  controllers: [SecurityTcpController],
  providers: [FnGetSecurityService, FnGetPermisionsService, FnFindUserService],
})
export class SecurityModule {}
