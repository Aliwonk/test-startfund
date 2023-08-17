import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FightersEntity, TypeWeightClasses } from './entities/fighter.entity';
import { Repository } from 'typeorm';
import { PersonalEntity } from './entities/personal.entity';
import { CreateFighterDTO } from './dto/create-fighter.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { RankingEntity } from '../rankings/entities/ranking.entity';

@Injectable()
export class FightersService {
  constructor(
    @InjectRepository(FightersEntity)
    private fighterRepository: Repository<FightersEntity>,
    @InjectRepository(PersonalEntity)
    private personalRepository: Repository<PersonalEntity>,
    @InjectRepository(RankingEntity)
    private rankingRepository: Repository<RankingEntity>,
  ) {}

  getWeightClass(gender: 'male' | 'female', weight: number): TypeWeightClasses {
    if (gender === 'male') {
      if (weight <= 57) return 'Flyweight';
      if (weight <= 61) return 'Bantamweight';

      if (weight <= 70) return 'Lightweight';
      if (weight <= 77) return 'Welterweight';
      if (weight <= 84) return 'Middleweight';
      if (weight <= 93) return 'Light Heavyweight';
      if (weight <= 120) return 'Heavyweight';
    } else {
      if (weight <= 52) return 'Strawweight';
      if (weight <= 57) return 'Flyweight';
      if (weight <= 61) return 'Bantamweight';
      if (weight <= 66) return 'Featherweight';
    }
  }

  // CREATE

  async createFighter(personal: CreateFighterDTO, uri_img: string) {
    try {
      const age =
        new Date().getFullYear() - parseInt(personal.dateofbirth.split('.')[2]);

      const weight_class = this.getWeightClass(
        personal.gender,
        personal.weight,
      );

      const savePersonal = await this.personalRepository.save({
        ...personal,
        age,
        uri_img,
      });

      if (savePersonal.id) {
        const saveFighter = await this.fighterRepository.save({
          weight_class,
          personal: savePersonal,
        });

        const saveRanking = await this.rankingRepository.save({
          weight_class,
          fighter: saveFighter,
        });

        const saveRankingInFighter = await this.fighterRepository.update(
          saveFighter.id,
          {
            ranking: saveRanking,
          },
        );

        if (saveFighter.id && saveRanking.id && saveRankingInFighter.affected) {
          throw new HttpException('Fighter created', HttpStatus.CREATED);
        }

        this.personalRepository.delete(savePersonal.id);
        unlink(join('./uploads', uri_img));
        throw new HttpException(
          'Fail fighter created',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      unlink(join('./uploads', uri_img));
      throw new HttpException(
        'Fail fighter created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
      if (error)
        throw new HttpException(
          'Fail fighter created',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  // UPDATE

  async updateFighter(id_fighter: string, data_update: any) {
    try {
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  // GET ONE

  async getOne(id_fighter: string) {
    try {
      const fighter = await this.fighterRepository.findOne({
        where: { id: id_fighter },
        relations: ['winning_fights', 'losing_fights', 'team'],
      });

      if (!fighter)
        throw new HttpException(
          `Fighter with id ${id_fighter} not found`,
          HttpStatus.NOT_FOUND,
        );

      return fighter;
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  // DELETE

  async deleteFighter(id_fighter: string) {
    try {
      const fighter = await this.fighterRepository.findOne({
        where: { id: id_fighter },
        relations: ['personal'],
      });

      if (!fighter)
        throw new HttpException(
          `Fighter with id ${id_fighter} not found`,
          HttpStatus.NOT_FOUND,
        );

      const delFighter = await this.fighterRepository.delete(fighter.id);

      if (delFighter.affected) {
        const delPersonal = await this.personalRepository.delete(
          fighter.personal.id,
        );

        unlink(join('./uploads', fighter.personal.uri_img));
        if (delPersonal.affected)
          throw new HttpException(`Fighter deleted`, HttpStatus.OK);
      }

      throw new HttpException(
        'Fail fighter deleted',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  // GET ALL

  async getAll() {
    try {
      return await this.fighterRepository.find();
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }
}
