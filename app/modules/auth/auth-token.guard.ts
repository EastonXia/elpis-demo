import { CanActivate, ExecutionContext, Injectable } from '@eastonshay/sara/dist/nest';
import { Reflector } from '@eastonshay/sara/dist/nest';
import { ConfigService } from '@eastonshay/sara/dist/config/config.service';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './public.decorator';

/**
 * 对照 app/middlewares/auth-token-verify.js
 * 白名单与 1.0 完全一致，只做精确匹配，不新增任何路径。
 */
const WHITE_LIST = ['/view/auth/login', '/api/auth/login', '/api/auth/logout'];

interface AuthRequest {
  path: string;
  originalUrl: string;
  headers: Record<string, string | string[] | undefined>;
  userId?: string;
}

interface AuthResponse {
  cookie(name: string, value: string, options: Record<string, unknown>): unknown;
  status(code: number): AuthResponse;
  json(body: unknown): unknown;
  redirect(status: number, url: string): void;
}

/**
 * 登录态校验（全局 APP_GUARD，由 AuthModule 注册）
 *
 * - 白名单路径 或 @Public() 的 handler 直接放行
 * - 无 token / token 无效：清 cookie，然后
 *   - API（originalUrl 含 api）：HTTP 200 + { success:false, code:50000, message:'请重新登录' }
 *   - 页面：302 /view/auth/login?callback=原 URL
 *
 * 响应在本 Guard 内直接写出，然后 return false。
 * Nest 会抛 ForbiddenException，由全局 AllExceptionsFilter 看到 headersSent 后跳过，不会二次写响应。
 */
@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest<AuthRequest>();
    const res = http.getResponse<AuthResponse>();

    if (WHITE_LIST.includes(req.path)) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const userId = this.verifyToken(this.readCookie(req, 'token'));
    if (userId !== undefined) {
      req.userId = userId;
      return true;
    }

    // 与 1.0 一致：失败时清空 cookie
    res.cookie('token', '', { expires: new Date(0) });

    if (req.originalUrl.indexOf('api') > -1) {
      res.status(200).json({
        success: false,
        code: 50000,
        message: '请重新登录',
      });
    } else {
      res.redirect(302, `/view/auth/login?callback=${req.originalUrl}`);
    }

    return false;
  }

  /** 与 1.0 一致：返回 decoded.userId；token 缺失或校验失败返回 undefined */
  private verifyToken(token: string | undefined): string | undefined {
    if (!token) {
      return undefined;
    }
    try {
      const jwtSecretKey = this.config.get<string>('jwtSecretKey') as string;
      const decoded = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload;
      return decoded.userId;
    } catch {
      return undefined;
    }
  }

  /** Nest 默认不解析 cookie（无 cookie-parser），这里从 Cookie 请求头取值 */
  private readCookie(req: AuthRequest, name: string): string | undefined {
    const header = req.headers.cookie;
    if (typeof header !== 'string') {
      return undefined;
    }
    for (const pair of header.split(';')) {
      const index = pair.indexOf('=');
      if (index < 0) {
        continue;
      }
      if (pair.slice(0, index).trim() === name) {
        return decodeURIComponent(pair.slice(index + 1).trim());
      }
    }
    return undefined;
  }
}
