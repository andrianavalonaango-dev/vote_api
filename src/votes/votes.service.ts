import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vote } from './entities/vote.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Poll } from '../polls/entities/poll.entity.js';
import { Option } from '../options/entities/option.entity.js';
import { CreateVoteDto } from './dto/create-vote.dto.js';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async create(
    createVoteDto: CreateVoteDto,
    pollId: number,
  ): Promise<Vote> {
    // 1. Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: { id: createVoteDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'id ${createVoteDto.userId} introuvable`,
      );
    }

    // 2. Vérifier que le sondage existe
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
    });

    if (!poll) {
      throw new NotFoundException(
        `Sondage avec l'id ${pollId} introuvable`,
      );
    }

    // 3. Vérifier que le sondage est encore actif
    if (poll.status === 'closed') {
      throw new ConflictException(
        'Ce sondage est fermé',
      );
    }

    // 4. Vérifier que le sondage n'est pas expiré
    if (new Date() > poll.expiresAt) {
      throw new ConflictException(
        'Ce sondage est expiré',
      );
    }

    // 5. Vérifier que l'option existe
    const option = await this.optionRepository.findOne({
      where: {
        id: createVoteDto.optionId,
      },
      relations: {
        poll: true,
      },
    });

    if (!option) {
      throw new NotFoundException(
        `Option avec l'id ${createVoteDto.optionId} introuvable`,
      );
    }

    // 6. Vérifier que l'option appartient au sondage
    if (option.poll.id !== poll.id) {
      throw new ConflictException(
        'Cette option n’appartient pas à ce sondage',
      );
    }

    // 7. Vérifier si l'utilisateur a déjà voté
    const existingVote = await this.voteRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        poll: {
          id: poll.id,
        },
      },
    });

    if (existingVote) {
      throw new ConflictException(
        'Cet utilisateur a déjà voté pour ce sondage',
      );
    }

    // 8. Créer le vote
    const vote = this.voteRepository.create({
      user,
      poll,
      option,
    });

    return this.voteRepository.save(vote);
  }

  async findAll(): Promise<Vote[]> {
    return this.voteRepository.find({
      relations: {
        user: true,
        poll: true,
        option: true,
      },
    });
  }

  async findByPoll(pollId: number): Promise<Vote[]> {
    return this.voteRepository.find({
      where: {
        poll: {
          id: pollId,
        },
      },
      relations: {
        user: true,
        option: true,
      },
    });
  }

  async findOne(id: number): Promise<Vote> {
    const vote = await this.voteRepository.findOne({
      where: { id },
      relations: {
        user: true,
        poll: true,
        option: true,
      },
    });

    if (!vote) {
      throw new NotFoundException(
        `Vote avec l'id ${id} introuvable`,
      );
    }

    return vote;
  }
}