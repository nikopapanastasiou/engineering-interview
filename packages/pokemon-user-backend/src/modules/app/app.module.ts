import { Module } from '@nestjs/common';
import { DbModule } from '../database/db.module';
import { ProfileModule } from '../profile/profile.module';
import { PokemonModule } from '../pokemon/pokemon.module';
import { TeamsModule } from '../teams/teams.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DbModule, ProfileModule, PokemonModule, TeamsModule, AuthModule],
})
export class AppModule {}
