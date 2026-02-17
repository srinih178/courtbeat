import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MusicService } from './music.service';

@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @ApiOperation({ summary: 'Get all music tracks' })
  findAll(@Query('energy') energy?: string) {
    return energy
      ? this.musicService.findByEnergy(energy)
      : this.musicService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add music track' })
  create(@Body() body: any) {
    return this.musicService.create(body);
  }
}
