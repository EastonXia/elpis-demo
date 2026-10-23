import { Body, Controller, Get, HttpCode, Post, Res } from '@eastonshay/sara/dist/nest';
import { BaseController } from '@eastonshay/sara/dist/common/base/base.controller';
import { ConfigService } from '@eastonshay/sara/dist/config/config.service';
import * as jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { Public } from './public.decorator';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

/**
 * 对照 app/controller/auth.js + app/router/auth.js
 * 路由与 1.0 一致：POST /api/auth/login、GET /api/auth/logout
 */
@Controller('api/auth')
export class AuthController extends BaseController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super();
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    // const userItem = await this.userService.getByUsernameAndPassword({
    //   username: body.username,
    //   password: body.password,
    // });
    // if (!userItem) {
    //   return this.fail('账号或密码错误', 50000);
    // }

    // 与 1.0 一致：账号校验仍为占位，Service 已就位
    const userItem = { user_id: '1', nickname: 'eastonshay' };

    // 利用 jwt 生成一个 token，挂载到 cookie 上
    const payload = { userId: userItem.user_id };
    const jwtSecretKey = this.configService.get<string>('jwtSecretKey') as string;
    const token = jwt.sign(payload, jwtSecretKey, {
      expiresIn: 60 * 60 * 24, // 一天有效
    });

    const expires = new Date();
    expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24); // 一天有效
    res.cookie('token', token, {
      expires,
      httpOnly: true,
    });

    return this.success({
      nickname: userItem.nickname,
    });
  }

  @Public()
  @Get('logout')
  logout(@Res() res: Response) {
    // 清空 cookie
    res.cookie('token', '', { expires: new Date(0) });

    // 重定向到登录页
    res.redirect(302, '/view/auth/login');
  }
}
