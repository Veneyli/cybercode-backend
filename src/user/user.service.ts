import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole, AuthMethod } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email || '',
          password: createUserDto.password || '',
          surname: createUserDto.surname || '',
          name: createUserDto.name || '',
          patronymic: createUserDto.patronymic || null,
          role: createUserDto.role || UserRole.REGULAR,
          authMethod: createUserDto.authMethod || AuthMethod.CREDENTIALS,
        },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Ошибка создания пользователя: ${error.message}`);
      }
      throw new Error('Неизвестная ошибка при создании пользователя');
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Ошибка получения пользователей: ${error.message}`);
      }
      throw new Error('Неизвестная ошибка при получении пользователей');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id: id },
        include: { progresses: true },
      });

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const progressesInfo = user.progresses.map((progress) => ({
        progressExists: true,
        courseId: progress.course_id,
      }));

      return { user, progressesInfo };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Ошибка получения пользователя: ${error.message}`);
      }
      throw new Error('Неизвестная ошибка при получении пользователя');
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email: email },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Ошибка получения пользователя: ${error.message}`);
      }
      throw new Error('Неизвестная ошибка при получении пользователя');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { user_id: id },
        data: {
          email: updateUserDto.email,
          password: updateUserDto.password,
          surname: updateUserDto.surname,
          name: updateUserDto.name,
          patronymic: updateUserDto.patronymic,
          role: updateUserDto.role,
        },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Ошибка обновления пользователя: ${error.message}`);
      }
      throw new Error('Неизвестная ошибка при обновлении пользователя');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { user_id: id },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Ошибка удаления пользователя: ${error.message}`);
      }
      throw new Error('Неизвестная ошибка при удалении пользователя');
    }
  }
}
