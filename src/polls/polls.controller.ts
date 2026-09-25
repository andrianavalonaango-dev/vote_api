import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PollsService } from './polls.service.js';
import { CreatePollDto } from './dto/create-poll.dto.js';
import { UpdatePollDto } from './dto/update-poll.dto.js';
import { UsersService } from '../users/users.service.js';

@Controller('polls')
export class PollsController {
  constructor(
    private readonly pollsService: PollsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() createPollDto: CreatePollDto,
  ) {
    // Pour le moment, on utilise l'utilisateur avec l'id 1.
    // L'authentification sera ajoutée plus tard.
    const user = await this.usersService.findOne(1);

    return this.pollsService.create(
      createPollDto,
      user,
    );
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollsService.update(
      id,
      updatePollDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.remove(id);
  }
}