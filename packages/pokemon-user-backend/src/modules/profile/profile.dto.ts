import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: 'ash@pokemon.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ash Ketchum', description: 'Display name' })
  @IsString()
  displayName: string;

  @ApiProperty({ description: 'Hashed password', minLength: 8 })
  @IsString()
  @MinLength(8)
  passwordHash: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'ash@pokemon.com', description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Ash Ketchum', description: 'Display name', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ description: 'Hashed password', minLength: 8, required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  passwordHash?: string;
}
