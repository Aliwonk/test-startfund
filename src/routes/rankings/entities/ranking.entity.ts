import { FightersEntity } from 'src/routes/fighters/entities/fighter.entity';
import { TypeWeightClasses } from 'src/routes/fighters/entities/fighter.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ranking')
export class RankingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'varchar' })
  weight_class: TypeWeightClasses;

  @OneToOne(() => FightersEntity, (fighter) => fighter.ranking)
  @JoinColumn()
  fighter: FightersEntity;
}
