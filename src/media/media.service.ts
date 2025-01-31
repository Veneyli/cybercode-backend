import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    try {
      return this.prisma.post.findMany();
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Неизвестная ошибка');
      }
    }
  }
  findById(id: string) {
    return this.prisma.post.findUnique({
      where: { post_id: parseInt(id, 10) },
    });
  }
}
