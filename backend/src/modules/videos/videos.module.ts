// videos.module.ts
import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MuxService } from './mux.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, MuxService],
  exports: [VideosService, MuxService],
})
export class VideosModule {}

// videos.service.ts - exported as part of the same file for efficiency
