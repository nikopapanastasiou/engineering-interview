import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  @Get()
  findAll() {
    return this.profiles.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profiles.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profiles.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profiles.remove(id);
  }
}
