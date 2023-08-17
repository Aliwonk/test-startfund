import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonalEntity } from './personal.entity';
import { FightsEntity } from 'src/routes/fights/entities/fight.entity';
import { TeamsEntity } from '../../teams/entities/team.entity';
import { RankingEntity } from 'src/routes/rankings/entities/ranking.entity';

export type TypeWeightClasses =
  | 'Strawweight'
  | 'Flyweight'
  | 'Bantamweight'
  | 'Featherweight'
  | 'Lightweight'
  | 'Welterweight'
  | 'Middleweight'
  | 'Light Heavyweight'
  | 'Heavyweight';

@Entity('fighters')
export class FightersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  knockouts: number;

  @Column({ type: 'int', default: 0 })
  submission: number;

  @Column({ type: 'varchar' })
  weight_class: TypeWeightClasses;

  @Column({ type: 'int', default: 0 })
  number_of_fights: number;

  @OneToOne(() => PersonalEntity, (personal) => personal.fighter, {
    eager: true,
  })
  @JoinColumn()
  personal: PersonalEntity;

  @OneToOne(() => RankingEntity, (ranking) => ranking.fighter, { eager: true })
  @JoinColumn()
  ranking: RankingEntity;

  @ManyToMany(() => FightsEntity)
  @JoinTable({ name: 'winning-fights-fighters' })
  winning_fights: Array<FightsEntity>;

  @ManyToMany(() => FightsEntity)
  @JoinTable({ name: 'losing-fights-fighters' })
  losing_fights: Array<FightsEntity>;

  @OneToMany(() => FightsEntity, (fights) => fights.fighters)
  fights: Array<FightsEntity>;

  @ManyToOne(() => TeamsEntity, (team) => team.fighters)
  team: TeamsEntity;
}
