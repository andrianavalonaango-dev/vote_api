import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { UsersModule } from './users/users.module.js';
import { PollsModule } from './polls/polls.module.js';
import { OptionsModule } from './options/options.module.js';
import { VotesModule } from './votes/votes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        timezone: 'Z',

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsersModule,
    PollsModule,
    OptionsModule,
    VotesModule,
  ],
})
export class AppModule {}