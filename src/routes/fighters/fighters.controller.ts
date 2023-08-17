import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFighterDTO } from './dto/create-fighter.dto';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName } from 'src/utils/file-filter.utils';
import { FightersService } from './fighters.service';

@Controller('fighters')
export class FightersController {
  constructor(private fighterService: FightersService) {}

  // CREATE

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: join('./uploads/figters-images'),
        filename: editFileName,
      }),
    }),
  )
  createFighter(
    @Body() createFighterDTO: CreateFighterDTO,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.fighterService.createFighter(
      createFighterDTO,
      `figters-images/${img.filename}`,
    );
  }

  // UPDATE

  @Put('/update/:id')
  updateFighter(@Param('id') id_fighter: string) {
    console.log(id_fighter);
  }

  // GET

  @Get('/get-one/:id')
  getOneFighter(@Param('id') id_fighter: string) {
    return this.fighterService.getOne(id_fighter);
  }

  // DELETE

  @Delete('/delete/:id')
  deleteFighter(@Param('id') id_fighter: string) {
    return this.fighterService.deleteFighter(id_fighter);
  }

  // GET ALL FIGHTERS

  @Get('/get-all')
  getAllFighters() {
    return this.fighterService.getAll();
  }
}
