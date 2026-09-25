import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { VotesService } from './votes.service.js';
import { CreateVoteDto } from './dto/create-vote.dto.js';

@Controller()
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
  ) {}

  @Post('polls/:pollId/vote')
  create(
    @Param('pollId', ParseIntPipe) pollId: number,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    return this.votesService.create(
      createVoteDto,
      pollId,
    );
  }

  @Get('polls/:pollId/votes')
  findByPoll(
    @Param('pollId', ParseIntPipe) pollId: number,
  ) {
    return this.votesService.findByPoll(pollId);
  }

  @Get('votes')
  findAll() {
    return this.votesService.findAll();
  }

  @Get('votes/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.votesService.findOne(id);
  }
}