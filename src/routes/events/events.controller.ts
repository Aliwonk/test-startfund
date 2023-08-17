import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  // CREATE

  @Post('/create')
  createEvent(@Body() createEventDTO: CreateEventDTO) {
    return this.eventService.create(createEventDTO);
  }

  // UPDATE

  @Put('/update/:id')
  updateEvent(@Param('id') id_event: string) {
    console.log(id_event);
  }

  // GET ONE

  @Get('/get-one/:id')
  getOne(@Param('id') id_event: string) {
    return this.eventService.getOne(id_event);
  }

  // DELETE
  @Delete('/delete/:id')
  delete(@Param('id') id_event: string) {
    return this.eventService.delete(id_event);
  }
}
