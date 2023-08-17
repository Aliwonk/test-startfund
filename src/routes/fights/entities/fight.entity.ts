import { FightersEntity } from 'src/routes/fighters/entities/fighter.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoundsEntity } from './round.entity';

@Entity('fights')
export class FightsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FightersEntity, (fighter) => fighter.winning_fights, {
    eager: true,
  })
  winner: FightersEntity;

  @ManyToOne(() => FightersEntity, (fighter) => fighter.losing_fights, {
    eager: true,
  })
  loser: FightersEntity;

  @OneToMany(() => RoundsEntity, (round) => round.fight)
  rounds: Array<RoundsEntity>;

  @ManyToMany(() => FightersEntity, (fighter) => fighter.fights)
  @JoinTable({ name: 'fight-participating-fighters' })
  fighters: Array<FightersEntity>;

  @CreateDateColumn()
  createdDate: Date;
}
