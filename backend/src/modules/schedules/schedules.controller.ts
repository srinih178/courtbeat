import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new schedule' })
  create(
    @Body() body: { clubId: string; workoutId: string; scheduledAt: string },
  ) {
    return this.schedulesService.create(
      body.clubId,
      body.workoutId,
      new Date(body.scheduledAt),
    );
  }

  @Get('club/:clubId')
  @ApiOperation({ summary: 'Get schedules for a club' })
  findByClub(
    @Param('clubId') clubId: string,
    @Query('upcoming') upcoming?: string,
  ) {
    return this.schedulesService.findByClub(clubId, upcoming !== 'false');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark schedule as completed' })
  markComplete(@Param('id') id: string) {
    return this.schedulesService.markComplete(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete schedule' })
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}

