import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';

import { Poll } from '../../polls/entities/poll.entity.js';
import { Vote } from '../../votes/entities/vote.entity.js';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Poll, (poll) => poll.options, {
    onDelete: 'CASCADE',
  })
  poll: Relation<Poll>;

  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Relation<Vote>[];
}