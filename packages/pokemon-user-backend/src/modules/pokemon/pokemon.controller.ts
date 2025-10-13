import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto, UpdatePokemonDto } from './pokemon.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Pokemon with pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated Pokemon list' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Pokemon by ID' })
  @ApiResponse({ status: 200, description: 'Returns Pokemon details' })
  @ApiResponse({ status: 404, description: 'Pokemon not found' })
  findOne(@Param('id') id: string) {
    return this.service.findById(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create new Pokemon' })
  @ApiResponse({ status: 201, description: 'Pokemon created successfully' })
  create(@Body() dto: CreatePokemonDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Pokemon' })
  @ApiResponse({ status: 200, description: 'Pokemon updated successfully' })
  @ApiResponse({ status: 404, description: 'Pokemon not found' })
  update(@Param('id') id: string, @Body() dto: UpdatePokemonDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Pokemon' })
  @ApiResponse({ status: 200, description: 'Pokemon deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pokemon not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
