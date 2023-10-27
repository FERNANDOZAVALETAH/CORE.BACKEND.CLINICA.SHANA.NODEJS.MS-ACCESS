import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { FnLoginService } from './services/fn-login.service';
import {
  Profiles,
  ProfilesSchema,
  Securities,
  SecuritiesSchema,
  Users,
  UsersSchema,
} from '../../common/schemas';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { KEYS } from 'src/const/keys.const';
import { FnLogoutService } from './services';

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
    JwtModule.register({
      global: true,
      secret: KEYS.jwt_secret,
      signOptions: { expiresIn: '365d' },
    }),
    CryptoModule,
  ],
  controllers: [AuthController],
  providers: [FnLoginService, FnLogoutService],
})
export class AuthModule {}
