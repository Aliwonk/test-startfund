import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FightsEntity } from './fight.entity';

@Entity('rounds')
export class RoundsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  start: Date;

  @Column({ type: 'time' })
  end: Date;

  @ManyToOne(() => FightsEntity, (fight) => fight.rounds)
  fight: FightsEntity;
}
