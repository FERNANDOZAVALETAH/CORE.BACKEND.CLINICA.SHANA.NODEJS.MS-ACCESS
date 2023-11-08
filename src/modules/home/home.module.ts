import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Home, HomeSchema } from 'src/common/schemas';
import { HomeController } from './home.http.controller';
import { HomeTcpController } from './home.tcp.controller';
import {
  FnHomeService,
  FnRegisterConsultingService,
  FnRegisterSessionService,
} from './services';
import { CryptoModule } from 'src/common/crypto/crypto.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Home.name,
        schema: HomeSchema,
      },
    ]),
    CryptoModule,
  ],
  controllers: [HomeController, HomeTcpController],
  providers: [
    FnRegisterSessionService,
    FnHomeService,
    FnRegisterConsultingService,
  ],
})
export class HomeModule {}
