import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      surname: string;
    },
  ) {
    return await this.authService.register({
      email: body.email,
      password: body.password,
      passwordRepeat: body.password,
      name: body.name,
      surname: body.surname,
    });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
  ) {
    const loginDto = { email: body.email, password: body.password };
    return await this.authService.login(loginDto, req);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }

  @Get('check-session')
  async checkSession(@Req() req: Request) {
    return await this.authService.checkSession(req);
  }
}
