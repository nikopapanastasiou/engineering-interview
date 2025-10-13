import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { AddPokemonDto, CreateTeamDto, UpdateTeamDto } from './team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user?.userId;
    return this.service.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/roster')
  roster(@Param('id') id: string) {
    return this.service.roster(id);
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateTeamDto) {
    const userId = req.user?.userId;
    return this.service.create({ ...dto, userId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/pokemon')
  addPokemon(@Param('id') id: string, @Body() dto: AddPokemonDto) {
    return this.service.addPokemon(id, dto.pokemonId);
  }

  @Delete(':id/pokemon/:pokemonId')
  removePokemon(@Param('id') id: string, @Param('pokemonId') pokemonId: string) {
    return this.service.removePokemon(id, Number(pokemonId));
  }
}
