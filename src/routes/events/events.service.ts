import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsEntity } from './entities/event.entity';
import { In, Repository } from 'typeorm';
import { CreateEventDTO } from './dto/create-event.dto';
import { FightsEntity } from '../fights/entities/fight.entity';
import { FightersEntity } from '../fighters/entities/fighter.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private eventsRepository: Repository<EventsEntity>,
    @InjectRepository(FightsEntity)
    private fightsRepository: Repository<FightsEntity>,
    @InjectRepository(FightersEntity)
    private fightersRepository: Repository<FightersEntity>,
  ) {}

  async create(createEventDTO: CreateEventDTO) {
    try {
      const fights = await this.fightsRepository.find({
        where: { id: In(createEventDTO.id_fights) },
        relations: ['fighters'],
      });

      if (fights.length < createEventDTO.id_fights.length)
        throw new HttpException('Fights not found', HttpStatus.BAD_REQUEST);

      const id_fighters = [];
      fights.forEach((fight) => {
        id_fighters.push(
          ...new Set(fight.fighters.map((fighter) => fighter.id)),
        );
      });

      const fighters = await this.fightersRepository.find({
        where: { id: In([...new Set(id_fighters)]) },
      });

      delete createEventDTO.id_fights;
      const saveEvent = await this.eventsRepository.save({
        ...createEventDTO,
        list_fights: fights,
        participating_fighters: fighters,
      });

      if (saveEvent.id)
        throw new HttpException('Event created', HttpStatus.CREATED);

      throw new HttpException(
        'Error event created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  async getOne(id_event: string) {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id: id_event },
        relations: ['list_fights', 'participating_fighters'],
      });

      if (!event)
        throw new HttpException(
          `Event wiht id ${id_event} not found`,
          HttpStatus.NOT_FOUND,
        );

      return event;
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  async delete(id_event: string) {
    try {
      const delEvent = await this.eventsRepository.delete(id_event);

      if (!delEvent.affected)
        throw new HttpException(
          `Fail event deleted`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      throw new HttpException(`Event deleted`, HttpStatus.OK);
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }
}
