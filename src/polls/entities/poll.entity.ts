import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Option } from '../../options/entities/option.entity.js';
import { Vote } from '../../votes/entities/vote.entity.js';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'closed'],
    default: 'active',
  })
  status: 'active' | 'closed';

  @ManyToOne(() => User, (user) => user.polls)
  @JoinColumn({ name: 'created_by' })
  creator: Relation<User>;

  @OneToMany(() => Option, (option) => option.poll)
  options: Relation<Option>[];

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Relation<Vote>[];
}