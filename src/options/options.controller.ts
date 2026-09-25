import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { OptionsService } from './options.service.js';
import { CreateOptionDto } from './dto/create-option.dto.js';

@Controller()
export class OptionsController {
  constructor(
    private readonly optionsService: OptionsService,
  ) {}

  @Post('polls/:pollId/options')
  create(
    @Param('pollId', ParseIntPipe) pollId: number,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.optionsService.create(
      createOptionDto,
      pollId,
    );
  }

  @Get('polls/:pollId/options')
  findByPoll(
    @Param('pollId', ParseIntPipe) pollId: number,
  ) {
    return this.optionsService.findByPoll(pollId);
  }

  @Get('options')
  findAll() {
    return this.optionsService.findAll();
  }

  @Get('options/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.optionsService.findOne(id);
  }

  @Delete('options/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.optionsService.remove(id);
  }
}