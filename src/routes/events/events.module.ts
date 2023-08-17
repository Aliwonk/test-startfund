import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsEntity } from './entities/event.entity';
import { FightsEntity } from '../fights/entities/fight.entity';
import { FightersEntity } from '../fighters/entities/fighter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventsEntity, FightsEntity, FightersEntity]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
