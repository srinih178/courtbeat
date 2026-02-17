import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Analytics } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(
    clubId: string,
    eventType: string,
    workoutId?: string,
    metadata?: any,
  ): Promise<Analytics> {
    return this.prisma.analytics.create({
      data: {
        clubId,
        eventType,
        workoutId,
        sessionId: this.generateSessionId(),
        metadata,
      },
    });
  }

  async getClubStats(clubId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await this.prisma.analytics.findMany({
      where: {
        clubId,
        timestamp: { gte: startDate },
      },
      orderBy: { timestamp: 'desc' },
    });

    const workoutPlays = events.filter((e) => e.eventType === 'workout_played').length;
    const sessions = new Set(events.map((e) => e.sessionId)).size;
    const uniqueWorkouts = new Set(
      events.filter((e) => e.workoutId).map((e) => e.workoutId),
    ).size;

    const workoutBreakdown = await this.prisma.analytics.groupBy({
      by: ['workoutId'],
      where: {
        clubId,
        eventType: 'workout_played',
        timestamp: { gte: startDate },
      },
      _count: true,
    });

    return {
      totalEvents: events.length,
      workoutPlays,
      sessions,
      uniqueWorkouts,
      workoutBreakdown,
      periodDays: days,
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
