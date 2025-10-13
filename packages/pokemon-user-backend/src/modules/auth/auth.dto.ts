import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'ash@pokemon.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ash Ketchum', description: 'Display name' })
  @IsString()
  displayName: string;

  @ApiProperty({ example: 'pikachu123', description: 'Password (min 8 characters)', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'ash@pokemon.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'pikachu123', description: 'Password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
