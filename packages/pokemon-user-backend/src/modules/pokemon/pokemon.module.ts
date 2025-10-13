import { Module } from '@nestjs/common';
import { DbModule } from '../database/db.module';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

@Module({
  imports: [DbModule],
  providers: [PokemonService],
  controllers: [PokemonController],
  exports: [PokemonService],
})
export class PokemonModule {}
