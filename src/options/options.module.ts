import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OptionsController } from './options.controller.js';
import { OptionsService } from './options.service.js';
import { Option } from './entities/option.entity.js';
import { Poll } from '../polls/entities/poll.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Option,
      Poll,
    ]),
  ],
  controllers: [OptionsController],
  providers: [OptionsService],
  exports: [OptionsService],
})
export class OptionsModule {}