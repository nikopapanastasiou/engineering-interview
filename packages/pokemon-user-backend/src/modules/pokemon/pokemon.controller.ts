import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

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
}
