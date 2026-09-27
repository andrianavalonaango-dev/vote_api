import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';

import { Poll } from '../../polls/entities/poll.entity.js';
import { Vote } from '../../votes/entities/vote.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

 @Column({ select: false })
password: string;

  @OneToMany(() => Poll, (poll) => poll.creator)
  polls: Relation<Poll>[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Relation<Vote>[];
}