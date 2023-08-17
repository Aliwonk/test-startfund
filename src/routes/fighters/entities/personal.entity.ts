import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FightersEntity } from './fighter.entity';

@Entity('personal')
export class PersonalEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'varchar' })
  surname: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  patronymic: string;

  @Column({ type: 'varchar' })
  uri_img: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'varchar' })
  nationality: string;

  @Column({ type: 'varchar' })
  gender: 'male' | 'female';

  @Column({ type: 'date' })
  dateofbirth: Date;

  @OneToOne(() => FightersEntity, (fighter) => fighter.personal)
  fighter: FightersEntity;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
