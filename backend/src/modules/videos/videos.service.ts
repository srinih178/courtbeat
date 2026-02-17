import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Video } from '@prisma/client';
import { MuxService } from './mux.service';

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private muxService: MuxService,
  ) {}

  async create(workoutId: string, file: Express.Multer.File): Promise<Video> {
    // Create initial video record
    const video = await this.prisma.video.create({
      data: {
        workoutId,
        fileName: file.originalname,
        fileSize: file.size,
        isProcessed: false,
      },
    });

    // Upload to Mux (async processing)
    this.uploadToMux(video.id, file).catch(console.error);

    return video;
  }

  private async uploadToMux(videoId: string, file: Express.Multer.File) {
    try {
      const asset = await this.muxService.createAsset(file.path);
      
      await this.prisma.video.update({
        where: { id: videoId },
        data: {
          muxAssetId: asset.id,
          muxPlaybackId: asset.playback_ids?.[0]?.id,
          streamUrl: `https://stream.mux.com/${asset.playback_ids?.[0]?.id}.m3u8`,
          duration: asset.duration ? Math.round(asset.duration) : null,
          isProcessed: true,
        },
      });
    } catch (error) {
      await this.prisma.video.update({
        where: { id: videoId },
        data: {
          isProcessed: false,
          processingError: error.message,
        },
      });
    }
  }

  async findAll(): Promise<Video[]> {
    return this.prisma.video.findMany({
      include: {
        workout: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        workout: true,
      },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return video;
  }

  async findByWorkout(workoutId: string): Promise<Video[]> {
    return this.prisma.video.findMany({
      where: { workoutId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string): Promise<Video> {
    const video = await this.findOne(id);

    // Delete from Mux if exists
    if (video.muxAssetId) {
      await this.muxService.deleteAsset(video.muxAssetId).catch(console.error);
    }

    return this.prisma.video.delete({
      where: { id },
    });
  }
}
