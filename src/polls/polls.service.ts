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
import { Cron } from '@nestjs/schedule';

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
  async getResults(pollId: number) {
  const poll = await this.pollRepository.findOne({
    where: { id: pollId },
    relations: {
      options: {
        votes: true,
      },
    },
  });

  if (!poll) {
    throw new NotFoundException(
      `Sondage avec l'id ${pollId} introuvable`,
    );
  }

  const totalVotes = poll.options.reduce(
    (total, option) => total + option.votes.length,
    0,
  );

  const results = poll.options.map((option) => {
    const votes = option.votes.length;

    const percentage =
      totalVotes === 0
        ? 0
        : Number(((votes / totalVotes) * 100).toFixed(2));

    return {
      optionId: option.id,
      text: option.text,
      votes,
      percentage,
    };
  });

  return {
    pollId: poll.id,
    title: poll.title,
    totalVotes,
    results,
  };
}
@Cron('* * * * *')
async closeExpiredPolls() {
  const now = new Date();

  const expiredPolls = await this.pollRepository
    .createQueryBuilder()
    .update(Poll)
    .set({ status: 'closed' })
    .where('status = :status', { status: 'active' })
    .andWhere('expiresAt <= :now', { now })
    .execute();

  if (expiredPolls.affected && expiredPolls.affected > 0) {
    console.log(
      `${expiredPolls.affected} sondage(s) fermé(s) automatiquement.`,
    );
  }
}
  async remove(id: number): Promise<void> {
    const poll = await this.findOne(id);

    await this.pollRepository.remove(poll);
  }
}