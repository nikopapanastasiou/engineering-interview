import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'ash@pokemon.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ash Ketchum' })
  @IsString()
  displayName: string;

  @ApiProperty({ example: 'pikachu123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'ash@pokemon.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'pikachu123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
