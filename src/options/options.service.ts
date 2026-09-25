import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Option } from './entities/option.entity.js';
import { CreateOptionDto } from './dto/create-option.dto.js';
import { Poll } from '../polls/entities/poll.entity.js';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
  ) {}

  async create(
    createOptionDto: CreateOptionDto,
    pollId: number,
  ): Promise<Option> {
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
    });

    if (!poll) {
      throw new NotFoundException(
        `Sondage avec l'id ${pollId} introuvable`,
      );
    }

    const option = this.optionRepository.create({
      ...createOptionDto,
      poll,
    });

    return this.optionRepository.save(option);
  }

  async findAll(): Promise<Option[]> {
    return this.optionRepository.find({
      relations: {
        poll: true,
      },
    });
  }

  async findByPoll(pollId: number): Promise<Option[]> {
    return this.optionRepository.find({
      where: {
        poll: {
          id: pollId,
        },
      },
    });
  }

  async findOne(id: number): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: { id },
      relations: {
        poll: true,
        votes: true,
      },
    });

    if (!option) {
      throw new NotFoundException(
        `Option avec l'id ${id} introuvable`,
      );
    }

    return option;
  }

  async remove(id: number): Promise<void> {
    const option = await this.findOne(id);

    await this.optionRepository.remove(option);
  }
}