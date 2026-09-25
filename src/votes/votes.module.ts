import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VotesController } from './votes.controller.js';
import { VotesService } from './votes.service.js';

import { Vote } from './entities/vote.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Poll } from '../polls/entities/poll.entity.js';
import { Option } from '../options/entities/option.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vote,
      User,
      Poll,
      Option,
    ]),
  ],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}