import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FightsEntity } from './entities/fight.entity';
import { In, Repository } from 'typeorm';
import { CreateFightDTO } from './dto/create-fight.dto';
import { FightersEntity } from '../fighters/entities/fighter.entity';
import { UpdateFightDTO } from './dto/update-fight.dto';
import { RankingEntity } from '../rankings/entities/ranking.entity';

@Injectable()
export class FightsService {
  constructor(
    @InjectRepository(FightersEntity)
    private fightersRepository: Repository<FightersEntity>,
    @InjectRepository(FightsEntity)
    private fightsRepository: Repository<FightsEntity>,
    @InjectRepository(RankingEntity)
    private rankingRepository: Repository<RankingEntity>,
  ) {}

  async createFight(createFightDTO: CreateFightDTO) {
    try {
      const fightersFromDB = await this.fightersRepository.find({
        where: { id: In(createFightDTO.id_fighters) },
        relations: ['personal'],
      });

      if (fightersFromDB.length < createFightDTO.id_fighters.length)
        throw new HttpException(`Fighter not found`, HttpStatus.NOT_FOUND);

      const failWeightClass = fightersFromDB.reduce((acc, curr) => {
        if (acc.weight_class !== curr.weight_class) return curr;
        return null;
      });

      if (!failWeightClass) {
        const saveFight = await this.fightsRepository.save({
          fighters: fightersFromDB,
        });

        if (saveFight.id)
          throw new HttpException(`Fight created`, HttpStatus.CREATED);

        throw new HttpException(
          `Fail fight created`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        `Weight categories do not match. Fighter with id ${failWeightClass.id} ${failWeightClass.weight_class}`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  async updateFight(id_fight: string, updateFightDTO: UpdateFightDTO) {
    try {
      const fight = await this.fightsRepository.findOne({
        where: { id: id_fight },
        relations: ['fighters'],
      });
      const winner_fighter = await this.fightersRepository.findOne({
        where: { id: updateFightDTO.winner.id },
        relations: ['winning_fights'],
      });
      const loser_fighter = await this.fightersRepository.findOne({
        where: { id: updateFightDTO.loser.id },
        relations: ['losing_fights'],
      });

      if (!fight)
        throw new HttpException(
          `Fight with id ${id_fight} not found`,
          HttpStatus.NOT_FOUND,
        );

      if (!winner_fighter || !loser_fighter)
        throw new HttpException(
          `Fighter with ${
            !winner_fighter ? updateFightDTO.winner.id : updateFightDTO.loser.id
          } not found`,
          HttpStatus.CREATED,
        );

      const updateRatingWinner = await this.rankingRepository.update(
        winner_fighter.ranking.id,
        {
          rating: winner_fighter.ranking.rating + updateFightDTO.winner.rating,
        },
      );

      const updateRatingLoser = await this.rankingRepository.update(
        loser_fighter.ranking.id,
        {
          rating: loser_fighter.ranking.rating + updateFightDTO.loser.rating,
        },
      );

      const updateFight = await this.fightsRepository.update(fight.id, {
        winner: winner_fighter,
        loser: loser_fighter,
      });

      //  save winning fight for winner

      Object.assign(winner_fighter, {
        knockouts: winner_fighter.knockouts + updateFightDTO.winner.knockouts,
        submission:
          winner_fighter.submission + updateFightDTO.winner.submission,
        wins: winner_fighter.wins + 1,
        number_of_fights: winner_fighter.number_of_fights + 1,
      });
      if (winner_fighter.winning_fights.length > 0) {
        const fights = [...winner_fighter.winning_fights, fight];
        Object.assign(winner_fighter, {
          winning_fights: fights,
        });
      } else {
        Object.assign(winner_fighter, { winning_fights: [fight] });
      }
      winner_fighter.save();

      //  save losing fight for loserF

      Object.assign(loser_fighter, {
        knockouts: loser_fighter.knockouts + updateFightDTO.loser.knockouts,
        submission: loser_fighter.submission + updateFightDTO.loser.submission,
        losses: loser_fighter.losses + 1,
        number_of_fights: loser_fighter.number_of_fights + 1,
      });
      if (loser_fighter.losing_fights.length === 0) {
        Object.assign(loser_fighter, { losing_fights: [fight] });
      } else {
        Object.assign(loser_fighter, {
          losing_fights: [...loser_fighter.losing_fights, fight],
        });
      }
      loser_fighter.save();

      if (
        updateFight.affected &&
        updateRatingLoser.affected &&
        updateRatingWinner.affected
      )
        throw new HttpException(`Fight updated`, HttpStatus.OK);

      throw new HttpException(
        `Fail fight updated`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  async getOne(id_fight: string) {
    try {
      const fight = await this.fightsRepository.findOne({
        where: { id: id_fight },
        relations: ['fighters', 'rounds'],
      });

      if (!fight)
        throw new HttpException(
          `Fight with id ${id_fight} not found`,
          HttpStatus.NOT_FOUND,
        );

      return fight;
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }

  async delete(id_fight: string) {
    try {
      const fight = await this.fightsRepository.findOne({
        where: { id: id_fight },
      });

      if (!fight)
        throw new HttpException(
          `Fight with id ${id_fight} not found`,
          HttpStatus.NOT_FOUND,
        );

      const delFight = await this.fightsRepository.delete(fight.id);

      if (delFight.affected)
        throw new HttpException(`Fight deleted`, HttpStatus.OK);

      throw new HttpException(
        `Fail fight deleted`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      console.log(error);
      if (error.response) throw new HttpException(error.response, error.status);
    }
  }
}
