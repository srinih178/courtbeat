import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload/:workoutId')
  @ApiOperation({ summary: 'Upload video for a workout' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadVideo(
    @Param('workoutId') workoutId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.videosService.create(workoutId, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({ status: 200, description: 'Return all videos' })
  findAll() {
    return this.videosService.findAll();
  }

  @Get('workout/:workoutId')
  @ApiOperation({ summary: 'Get videos for a workout' })
  @ApiResponse({ status: 200, description: 'Return videos for workout' })
  findByWorkout(@Param('workoutId') workoutId: string) {
    return this.videosService.findByWorkout(workoutId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video by ID' })
  @ApiResponse({ status: 200, description: 'Return video details' })
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete video' })
  @ApiResponse({ status: 200, description: 'Video deleted' })
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
