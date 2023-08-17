import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FightersEntity } from '../../fighters/entities/fighter.entity';
import { FightsEntity } from 'src/routes/fights/entities/fight.entity';

@Entity('teams')
export class TeamsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => FightersEntity, (fighter) => fighter.team)
  fighters: Array<FightersEntity>;

  @ManyToMany(() => FightsEntity)
  @JoinTable({ name: 'team-fights' })
  list_fights: Array<FightsEntity>;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
