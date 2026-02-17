import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SubscriptionTier } from '@prisma/client';

export class CreateClubDto {
  @ApiProperty({ example: "Diego's Padel Club" })
  @IsString()
  name: string;

  @ApiProperty({ example: 'diego@padelclub.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '123 Racket Street, Miami, FL' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Diego Martinez' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ example: '+1-555-0123' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ enum: SubscriptionTier, default: SubscriptionTier.BASE })
  @IsOptional()
  @IsEnum(SubscriptionTier)
  subscriptionTier?: SubscriptionTier;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasReformer?: boolean;
}

export class UpdateClubDto extends PartialType(CreateClubDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export { SubscriptionTier };
