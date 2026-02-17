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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { CreateClubDto, UpdateClubDto } from './dto';

@ApiTags('clubs')
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new club' })
  @ApiResponse({ status: 201, description: 'Club created successfully' })
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clubs' })
  @ApiResponse({ status: 200, description: 'Return all clubs' })
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.clubsService.findAll(includeInactive === 'true');
  }

  @Get('access/:code')
  @ApiOperation({ summary: 'Get club by access code (for member access)' })
  @ApiResponse({ status: 200, description: 'Return club details' })
  findByAccessCode(@Param('code') code: string) {
    return this.clubsService.findByAccessCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get club by ID' })
  @ApiResponse({ status: 200, description: 'Return club details' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get club statistics' })
  @ApiResponse({ status: 200, description: 'Return club stats' })
  getStats(@Param('id') id: string) {
    return this.clubsService.getStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update club' })
  @ApiResponse({ status: 200, description: 'Club updated successfully' })
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto);
  }

  @Patch(':id/upgrade')
  @ApiOperation({ summary: 'Upgrade club to premium' })
  @ApiResponse({ status: 200, description: 'Club upgraded to premium' })
  upgradeToPremium(@Param('id') id: string) {
    return this.clubsService.upgradeToPremium(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate club' })
  @ApiResponse({ status: 200, description: 'Club deactivated' })
  remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }
}
