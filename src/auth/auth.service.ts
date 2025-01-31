import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name, surname } = dto;

    const isExists = await this.userService.findByEmail(email);
    if (isExists) {
      throw new ConflictException(
        'Регистрация не удалась. Пользователь с таким email уже существует.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      email,
      password: hashedPassword,
      name,
      surname,
      role: 'REGULAR',
      authMethod: 'CREDENTIALS',
    });

    const token = this.generateJwtToken(user);
    return { user, token };
  }

  async login(dto: LoginDto, req: Request) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Неверный пароль.');
    }

    req.session.userId = user.user_id;
    req.session.email = user.email;

    const token = this.generateJwtToken(user);
    return { user, token };
  }

  async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Ошибка при уничтожении сессии:', err);
          return reject(
            new BadRequestException('Ошибка при выходе из системы.'),
          );
        }
        resolve({ message: 'Выход из системы выполнен успешно.' });
      });
    });
  }

  async checkSession(req: Request) {
    if (req.session.userId && req.session.email) {
      const user = await this.prisma.user.findUnique({
        where: { user_id: req.session.userId },
      });
      if (user) {
        return { user };
      }
    }
    throw new UnauthorizedException(
      'Сессия не найдена или пользователь не авторизован.',
    );
  }

  private generateJwtToken(user: any) {
    const secretKey = this.configService.get<string>('COOKIES_SECRET');
    return this.jwtService.sign(
      { userId: user.user_id, email: user.email },
      {
        secret: secretKey,
        expiresIn: '1h',
      },
    );
  }
}
