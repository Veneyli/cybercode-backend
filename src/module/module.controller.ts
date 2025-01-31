import { Controller, Get, Param } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}
  @Get()
  findAll() {
    return this.moduleService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.moduleService.findById(id);
  }
}
