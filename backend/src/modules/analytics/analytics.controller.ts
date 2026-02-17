import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track an analytics event' })
  trackEvent(
    @Body()
    body: {
      clubId: string;
      eventType: string;
      workoutId?: string;
      metadata?: any;
    },
  ) {
    return this.analyticsService.trackEvent(
      body.clubId,
      body.eventType,
      body.workoutId,
      body.metadata,
    );
  }

  @Get('club/:clubId/stats')
  @ApiOperation({ summary: 'Get club statistics' })
  getClubStats(
    @Param('clubId') clubId: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getClubStats(
      clubId,
      days ? parseInt(days) : 30,
    );
  }
}
