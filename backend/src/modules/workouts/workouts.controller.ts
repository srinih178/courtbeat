import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutFilterDto } from './dto';

@ApiTags('workouts')
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
  @ApiResponse({ status: 201, description: 'Workout created successfully' })
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.create(createWorkoutDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workouts with optional filtering' })
  @ApiResponse({ status: 200, description: 'Return all workouts' })
  findAll(@Query() filter: WorkoutFilterDto) {
    return this.workoutsService.findAll(filter);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular workouts' })
  @ApiResponse({ status: 200, description: 'Return popular workouts' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getPopular(@Query('limit') limit?: string) {
    return this.workoutsService.getPopular(limit ? parseInt(limit) : 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workout by ID' })
  @ApiResponse({ status: 200, description: 'Return workout details' })
  findOne(@Param('id') id: string) {
    return this.workoutsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workout' })
  @ApiResponse({ status: 200, description: 'Workout updated successfully' })
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutsService.update(id, updateWorkoutDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate workout' })
  @ApiResponse({ status: 200, description: 'Workout deactivated' })
  remove(@Param('id') id: string) {
    return this.workoutsService.remove(id);
  }
}
