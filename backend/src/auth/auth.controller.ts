import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RequestWithUser } from './interface/request-with-user.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(registerDto);

    // TODO: (REFACTOR !DRY) register route와 login route에서 아래의 코드가 반복되고 있음.
    //        Method로 extact하는 방안 고려. (extact해도 testable할까?)
    const token = this.authService.generateToken({
      sub: user.id,
      username: user.username,
    });
    req.res
      .cookie('Authentication', token, {
        httpOnly: true,
        path: '/',
        // TODO: (DEPLOY) SSL 적용 후 `secure: true`로 변경 (또는 environment에 따라 true 또는 false를 반환하는 코드 작성)
        secure: false,
        maxAge: this.configService.get('JWT_EXPIRES_IN') * 1000,
      })
      .send();
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  login(@Req() req: RequestWithUser) {
    const { user } = req;
    user.password = undefined;

    const token = this.authService.generateToken({
      sub: user.id,
      username: user.username,
    });
    req.res
      .cookie('Authentication', token, {
        httpOnly: true,
        // TODO: (DEPLOY) SSL 적용 후 `secure: true`로 변경 (또는 environment에 따라 true 또는 false를 반환하는 코드 작성)
        path: '/',
        secure: false,
        maxAge: this.configService.get('JWT_EXPIRES_IN') * 1000,
      })
      .send();
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    return req.res
      .cookie('Authentication', '', {
        httpOnly: true,
        path: '/',
        secure: false,
        maxAge: 0,
      })
      .send();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: RequestWithUser): User {
    return req.user;
  }
}
