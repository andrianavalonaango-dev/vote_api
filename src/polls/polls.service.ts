import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Poll } from './entities/poll.entity.js';
import { CreatePollDto } from './dto/create-poll.dto.js';
import { UpdatePollDto } from './dto/update-poll.dto.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async create(
    createPollDto: CreatePollDto,
    user: User,
  ): Promise<Poll> {
    const poll = this.pollRepository.create({
      ...createPollDto,
      expiresAt: new Date(createPollDto.expiresAt),
      creator: user,
    });

    return this.pollRepository.save(poll);
  }

 async findAll(): Promise<Poll[]> {
  return this.pollRepository.find({
    relations: {
      creator: true,
      options: true,
    },
  });
}

 async findOne(id: number): Promise<Poll> {
  const poll = await this.pollRepository.findOne({
    where: { id },
    relations: {
      creator: true,
      options: true,
      votes: true,
    },
  });

  if (!poll) {
    throw new NotFoundException(
      `Sondage avec l'id ${id} introuvable`,
    );
  }

  return poll;
}

  async update(
    id: number,
    updatePollDto: UpdatePollDto,
  ): Promise<Poll> {
    const poll = await this.findOne(id);

    Object.assign(poll, {
      ...updatePollDto,
      expiresAt: updatePollDto.expiresAt
        ? new Date(updatePollDto.expiresAt)
        : poll.expiresAt,
    });

    return this.pollRepository.save(poll);
  }

  async remove(id: number): Promise<void> {
    const poll = await this.findOne(id);

    await this.pollRepository.remove(poll);
  }
}