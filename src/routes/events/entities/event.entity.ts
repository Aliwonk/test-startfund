import { FightersEntity } from 'src/routes/fighters/entities/fighter.entity';
import { FightsEntity } from 'src/routes/fights/entities/fight.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events')
export class EventsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  time: string;

  @ManyToMany(() => FightsEntity)
  @JoinTable({ name: 'event-list-fights' })
  list_fights: Array<FightsEntity>;

  @ManyToMany(() => FightersEntity)
  @JoinTable({ name: 'event-participating-fighters' })
  participating_fighters: Array<FightersEntity>;

  @CreateDateColumn()
  createdDate: Date;
}
