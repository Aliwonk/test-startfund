import { Module } from '@nestjs/common';
import { FightersController } from './fighters.controller';
import { FightersService } from './fighters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightersEntity } from './entities/fighter.entity';
import { PersonalEntity } from './entities/personal.entity';
import { RankingEntity } from '../rankings/entities/ranking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FightersEntity, PersonalEntity, RankingEntity]),
  ],
  controllers: [FightersController],
  providers: [FightersService],
})
export class FightersModule {}
