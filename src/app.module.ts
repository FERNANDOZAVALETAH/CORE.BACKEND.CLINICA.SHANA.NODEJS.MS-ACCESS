import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { SecurityModule } from './modules/security/security.module';
import { LogModule } from './common/client/log/logs.module';
import { AccessModule } from './common/client/access/access.module';
import { HomeModule } from './modules/home/home.module';
import { CryptoModule } from './common/crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mongodb'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('http.throttle.ttl'),
        limit: config.get('http.throttle.limit'),
      }),
    }),
    AccessModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('client.access'),
      inject: [ConfigService],
    }),
    LogModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('client.logs'),
      inject: [ConfigService],
    }),
    AuthModule,
    SecurityModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
