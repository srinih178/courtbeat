import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateClubDto, UpdateClubDto } from './dto';
import { Club, SubscriptionTier } from '@prisma/client';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const existing = await this.prisma.club.findUnique({
      where: { email: createClubDto.email },
    });

    if (existing) {
      throw new ConflictException('Club with this email already exists');
    }

    // Generate unique access code
    const accessCode = this.generateAccessCode();

    return this.prisma.club.create({
      data: {
        ...createClubDto,
        accessCode,
      },
    });
  }

  async findAll(includeInactive = false): Promise<Club[]> {
    return this.prisma.club.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.prisma.club.findUnique({
      where: { id },
      include: {
        schedules: {
          take: 10,
          orderBy: { scheduledAt: 'desc' },
        },
        analytics: {
          take: 100,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }

    return club;
  }

  async findByAccessCode(accessCode: string): Promise<Club> {
    const club = await this.prisma.club.findUnique({
      where: { accessCode },
    });

    if (!club) {
      throw new NotFoundException('Invalid access code');
    }

    if (!club.isActive) {
      throw new ConflictException('This club is not active');
    }

    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club> {
    await this.findOne(id); // Check if exists

    return this.prisma.club.update({
      where: { id },
      data: updateClubDto,
    });
  }

  async remove(id: string): Promise<Club> {
    await this.findOne(id); // Check if exists

    return this.prisma.club.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async upgradeToPremium(id: string): Promise<Club> {
    await this.findOne(id); // Check if exists

    return this.prisma.club.update({
      where: { id },
      data: {
        subscriptionTier: SubscriptionTier.PREMIUM,
      },
    });
  }

  async getStats(id: string) {
    const club = await this.findOne(id);

    const totalWorkouts = await this.prisma.analytics.count({
      where: {
        clubId: id,
        eventType: 'workout_played',
      },
    });

    const totalSessions = await this.prisma.analytics.count({
      where: {
        clubId: id,
        eventType: 'session_started',
      },
    });

    const scheduledWorkouts = await this.prisma.schedule.count({
      where: {
        clubId: id,
        scheduledAt: {
          gte: new Date(),
        },
      },
    });

    return {
      club,
      stats: {
        totalWorkouts,
        totalSessions,
        scheduledWorkouts,
      },
    };
  }

  private generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
