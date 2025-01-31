import { Controller, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mediaService.findById(id);
  }
}
