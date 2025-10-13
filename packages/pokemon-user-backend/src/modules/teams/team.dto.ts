import { IsArray, IsOptional, IsString, IsUUID, ValidateNested, IsInt, Min } from 'class-validator';

export class CreateTeamDto {
  @IsUUID()
  userId: string;

  @IsString()
  name: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class AddPokemonDto {
  @IsInt()
  @Min(1)
  pokemonId: number;
}
