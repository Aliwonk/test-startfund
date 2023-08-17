import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FightsService } from './fights.service';
import { CreateFightDTO } from './dto/create-fight.dto';
import { UpdateFightDTO } from './dto/update-fight.dto';

@Controller('fights')
export class FightsController {
  constructor(private fightService: FightsService) {}

  // CREATE

  @Post('/create')
  create(@Body() createFightDTO: CreateFightDTO) {
    return this.fightService.createFight(createFightDTO);
  }

  // UPDATE

  @Put('/update/:id')
  update(
    @Param('id') id_fight: string,
    @Body() updateFightDTO: UpdateFightDTO,
  ) {
    return this.fightService.updateFight(id_fight, updateFightDTO);
  }

  // GET ONE

  @Get('/get-one/:id')
  getOne(@Param('id') id_fight: string) {
    return this.fightService.getOne(id_fight);
  }

  // DELETE

  @Delete('/delete/:id')
  delete(@Param('id') id_fight: string) {
    return this.fightService.delete(id_fight);
  }
}
