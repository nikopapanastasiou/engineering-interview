import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { AddPokemonDto, CreateTeamDto, UpdateTeamDto } from './team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../../common/types/auth.types';

@ApiTags('teams')
@ApiBearerAuth('JWT-auth')
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teams for current user' })
  @ApiResponse({ status: 200, description: 'Returns user teams' })
  findAll(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.service.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiResponse({ status: 200, description: 'Returns team details' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/roster')
  @ApiOperation({ summary: 'Get team roster with Pokemon details' })
  @ApiResponse({ status: 200, description: 'Returns team roster' })
  roster(@Param('id') id: string) {
    return this.service.roster(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created' })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateTeamDto) {
    const userId = req.user.userId;
    return this.service.create({ ...dto, userId });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update team name' })
  @ApiResponse({ status: 200, description: 'Team updated' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({ status: 200, description: 'Team deleted' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/pokemon')
  @ApiOperation({ summary: 'Add Pokemon to team' })
  @ApiResponse({ status: 201, description: 'Pokemon added to team' })
  @ApiResponse({ status: 400, description: 'Team is full or Pokemon already in team' })
  addPokemon(@Param('id') id: string, @Body() dto: AddPokemonDto) {
    return this.service.addPokemon(id, dto.pokemonId);
  }

  @Delete(':id/pokemon/:pokemonId')
  @ApiOperation({ summary: 'Remove Pokemon from team' })
  @ApiResponse({ status: 200, description: 'Pokemon removed from team' })
  removePokemon(@Param('id') id: string, @Param('pokemonId') pokemonId: string) {
    return this.service.removePokemon(id, Number(pokemonId));
  }
}
