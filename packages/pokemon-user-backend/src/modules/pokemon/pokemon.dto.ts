import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePokemonDto {
  @ApiProperty({ example: 25, description: 'Pokemon ID', minimum: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'pikachu', description: 'Pokemon name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 4, description: 'Height in decimeters' })
  @IsOptional()
  @IsInt()
  height?: number | null;

  @ApiPropertyOptional({ example: 60, description: 'Weight in hectograms' })
  @IsOptional()
  @IsInt()
  weight?: number | null;

  @ApiPropertyOptional({ example: 112, description: 'Base experience' })
  @IsOptional()
  @IsInt()
  baseExperience?: number | null;

  @ApiPropertyOptional({ example: ['electric'], description: 'Pokemon types' })
  @IsOptional()
  @IsArray()
  types?: string[];

  @ApiPropertyOptional({ example: ['static', 'lightning-rod'], description: 'Pokemon abilities' })
  @IsOptional()
  @IsArray()
  abilities?: string[];

  @ApiPropertyOptional({ description: 'Pokemon stats' })
  @IsOptional()
  stats?: Record<string, number> | null;

  @ApiPropertyOptional({ description: 'Pokemon sprites' })
  @IsOptional()
  sprites?: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.', description: 'Pokemon description' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 'Seed Pokémon', description: 'Pokemon genus/category' })
  @IsOptional()
  @IsString()
  genus?: string | null;

  @ApiPropertyOptional({ example: 'generation-i', description: 'Generation' })
  @IsOptional()
  @IsString()
  generation?: string | null;

  @ApiPropertyOptional({ example: 'grassland', description: 'Habitat' })
  @IsOptional()
  @IsString()
  habitat?: string | null;

  @ApiPropertyOptional({ example: 'quadruped', description: 'Body shape' })
  @IsOptional()
  @IsString()
  shape?: string | null;

  @ApiPropertyOptional({ example: 'green', description: 'Primary color' })
  @IsOptional()
  @IsString()
  color?: string | null;

  @ApiPropertyOptional({ example: false, description: 'Is legendary Pokemon' })
  @IsOptional()
  isLegendary?: boolean | null;

  @ApiPropertyOptional({ example: false, description: 'Is mythical Pokemon' })
  @IsOptional()
  isMythical?: boolean | null;

  @ApiPropertyOptional({ example: 1, description: 'Evolution chain ID' })
  @IsOptional()
  @IsInt()
  evolutionChainId?: number | null;

  @ApiPropertyOptional({ example: 45, description: 'Capture rate (0-255)' })
  @IsOptional()
  @IsInt()
  captureRate?: number | null;

  @ApiPropertyOptional({ example: 70, description: 'Base happiness (0-255)' })
  @IsOptional()
  @IsInt()
  baseHappiness?: number | null;

  @ApiPropertyOptional({ example: 'medium-slow', description: 'Growth rate' })
  @IsOptional()
  @IsString()
  growthRate?: string | null;
}

export class UpdatePokemonDto {
  @ApiPropertyOptional({ example: 'pikachu', description: 'Pokemon name' })
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
