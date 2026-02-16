import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { WorkoutType, SportType, WorkoutDifficulty } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Padel Pre-Match Conditioning' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Dynamic warm-up routine for padel players' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: WorkoutType, example: WorkoutType.CONDITIONING })
  @IsEnum(WorkoutType)
  type: WorkoutType;

  @ApiPropertyOptional({ enum: SportType, default: SportType.GENERAL })
  @IsOptional()
  @IsEnum(SportType)
  sportType?: SportType;

  @ApiPropertyOptional({ enum: WorkoutDifficulty, default: WorkoutDifficulty.ALL_LEVELS })
  @IsOptional()
  @IsEnum(WorkoutDifficulty)
  difficulty?: WorkoutDifficulty;

  @ApiProperty({ example: 20, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  requiresReformer?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  requiresRacket?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  requiresMat?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  hasVerbalCues?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasVisualMods?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructorNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class WorkoutFilterDto {
  @ApiPropertyOptional({ enum: WorkoutType })
  @IsOptional()
  @IsEnum(WorkoutType)
  type?: WorkoutType;

  @ApiPropertyOptional({ enum: SportType })
  @IsOptional()
  @IsEnum(SportType)
  sportType?: SportType;

  @ApiPropertyOptional({ enum: WorkoutDifficulty })
  @IsOptional()
  @IsEnum(WorkoutDifficulty)
  difficulty?: WorkoutDifficulty;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  requiresReformer?: boolean;

  @ApiPropertyOptional({ type: Boolean, description: 'Filter based on club reformer access' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasReformerAccess?: boolean;
}

export { WorkoutType, SportType, WorkoutDifficulty };
