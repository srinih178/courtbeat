import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Schedule } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(clubId: string, workoutId: string, scheduledAt: Date): Promise<Schedule> {
    const workout = await this.prisma.workout.findUnique({ where: { id: workoutId } });
    if (!workout) throw new NotFoundException('Workout not found');

    return this.prisma.schedule.create({
      data: {
        clubId,
        workoutId,
        scheduledAt,
        duration: workout.duration,
      },
      include: {
        workout: true,
      },
    });
  }

  async findByClub(clubId: string, upcoming = true): Promise<Schedule[]> {
    const now = new Date();
    return this.prisma.schedule.findMany({
      where: {
        clubId,
        scheduledAt: upcoming ? { gte: now } : { lt: now },
      },
      include: {
        workout: {
          include: {
            videos: {
              where: { isProcessed: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { scheduledAt: upcoming ? 'asc' : 'desc' },
      take: 50,
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        workout: {
          include: {
            videos: true,
          },
        },
        club: true,
      },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async markComplete(id: string): Promise<Schedule> {
    return this.prisma.schedule.update({
      where: { id },
      data: { isCompleted: true },
    });
  }

  async remove(id: string): Promise<Schedule> {
    return this.prisma.schedule.delete({ where: { id } });
  }
}

