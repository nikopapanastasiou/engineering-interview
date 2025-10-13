import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsString()
  @MinLength(8)
  passwordHash: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  passwordHash?: string;
}
