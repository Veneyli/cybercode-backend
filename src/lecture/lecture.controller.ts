import { Controller, Get, Param } from '@nestjs/common';
import { LectureService } from './lecture.service';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  findAll() {
    return this.lectureService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.lectureService.findById(id);
  }
}
