import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWorkoutDto, UpdateWorkoutDto, WorkoutFilterDto } from './dto';
import { Workout, WorkoutType, SportType, WorkoutDifficulty } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    return this.prisma.workout.create({
      data: createWorkoutDto,
      include: {
        videos: true,
      },
    });
  }

  async findAll(filter?: WorkoutFilterDto): Promise<Workout[]> {
    const where: any = {
      isActive: true,
    };

    if (filter?.type) {
      where.type = filter.type;
    }

    if (filter?.sportType) {
      where.sportType = filter.sportType;
    }

    if (filter?.difficulty) {
      where.difficulty = filter.difficulty;
    }

    if (filter?.requiresReformer !== undefined) {
      where.requiresReformer = filter.requiresReformer;
    }

    if (filter?.hasReformerAccess === false) {
      where.requiresReformer = false;
    }

    return this.prisma.workout.findMany({
      where,
      include: {
        videos: {
          where: { isProcessed: true },
          select: {
            id: true,
            streamUrl: true,
            duration: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string): Promise<Workout> {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        videos: true,
        schedules: {
          take: 10,
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }

    return workout;
  }

  async findByType(type: WorkoutType): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: {
        type,
        isActive: true,
      },
      include: {
        videos: {
          where: { isProcessed: true },
        },
      },
    });
  }

  async update(id: string, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    await this.findOne(id); // Check if exists

    return this.prisma.workout.update({
      where: { id },
      data: updateWorkoutDto,
      include: {
        videos: true,
      },
    });
  }

  async remove(id: string): Promise<Workout> {
    await this.findOne(id); // Check if exists

    return this.prisma.workout.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getPopular(limit = 10): Promise<Workout[]> {
    // Get workouts with most plays
    const popular = await this.prisma.analytics.groupBy({
      by: ['workoutId'],
      where: {
        eventType: 'workout_played',
        workoutId: { not: null },
      },
      _count: {
        workoutId: true,
      },
      orderBy: {
        _count: {
          workoutId: 'desc',
        },
      },
      take: limit,
    });

    const workoutIds = popular.map((p) => p.workoutId).filter(Boolean) as string[];

    return this.prisma.workout.findMany({
      where: {
        id: { in: workoutIds },
        isActive: true,
      },
      include: {
        videos: {
          where: { isProcessed: true },
          take: 1,
        },
      },
    });
  }
}
