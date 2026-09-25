import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  type Relation,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Poll } from '../../polls/entities/poll.entity.js';
import { Option } from '../../options/entities/option.entity.js';

@Entity('votes')
@Unique(['user', 'poll'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes, {
    onDelete: 'CASCADE',
  })
  user: Relation<User>;

  @ManyToOne(() => Poll, (poll) => poll.votes, {
    onDelete: 'CASCADE',
  })
  poll: Relation<Poll>;

  @ManyToOne(() => Option, (option) => option.votes, {
    onDelete: 'CASCADE',
  })
  option: Relation<Option>;

  @CreateDateColumn()
  createdAt: Date;
}