import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MusicTrack } from '@prisma/client';

@Injectable()
export class MusicService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<MusicTrack[]> {
    return this.prisma.musicTrack.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEnergy(energy: string): Promise<MusicTrack[]> {
    return this.prisma.musicTrack.findMany({
      where: { energy, isActive: true },
      orderBy: { bpm: 'desc' },
    });
  }

  async create(data: Partial<MusicTrack>): Promise<MusicTrack> {
    return this.prisma.musicTrack.create({ data: data as any });
  }
}
