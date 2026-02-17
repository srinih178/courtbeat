import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma/prisma.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { VideosModule } from './modules/videos/videos.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { MusicModule } from './modules/music/music.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ClubsModule,
    WorkoutsModule,
    VideosModule,
    SchedulesModule,
    AnalyticsModule,
    MusicModule,
  ],
})
export class AppModule {}
