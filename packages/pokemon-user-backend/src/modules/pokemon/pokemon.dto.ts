import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  height?: number | null;

  @IsOptional()
  @IsInt()
  weight?: number | null;

  @IsOptional()
  @IsInt()
  baseExperience?: number | null;

  @IsOptional()
  @IsArray()
  types?: string[];

  @IsOptional()
  @IsArray()
  abilities?: string[];

  @IsOptional()
  stats?: Record<string, number> | null;

  @IsOptional()
  sprites?: Record<string, unknown> | null;
}

export class UpdatePokemonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  height?: number | null;

  @IsOptional()
  @IsInt()
  weight?: number | null;

  @IsOptional()
  @IsInt()
  baseExperience?: number | null;

  @IsOptional()
  @IsArray()
  types?: string[];

  @IsOptional()
  @IsArray()
  abilities?: string[];

  @IsOptional()
  stats?: Record<string, number> | null;

  @IsOptional()
  sprites?: Record<string, unknown> | null;
}
