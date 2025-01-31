import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    try {
      return this.prisma.course.findMany();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Неизвестная ошибка');
    }
  }
  findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { course_id: parseInt(id, 10) },
    });
  }
}
