import { Module } from '@nestjs/common';
import { FightsController } from './fights.controller';
import { FightsService } from './fights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightsEntity } from './entities/fight.entity';
import { FightersEntity } from '../fighters/entities/fighter.entity';
import { RankingEntity } from '../rankings/entities/ranking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FightsEntity, FightersEntity, RankingEntity]),
  ],
  controllers: [FightsController],
  providers: [FightsService],
})
export class FightsModule {}
