import { IsArray, IsOptional, IsString, IsUUID, ValidateNested, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'My Elite Four Team', description: 'Team name' })
  @IsString()
  name: string;
}

export class UpdateTeamDto {
  @ApiPropertyOptional({ example: 'Updated Team Name', description: 'New team name' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class AddPokemonDto {
  @ApiProperty({ example: 25, description: 'Pokemon ID to add to team', minimum: 1 })
  @IsInt()
  @Min(1)
  pokemonId: number;
}
