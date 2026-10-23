import { IsDefined, IsString } from 'class-validator';

/**
 * 对照 app/router-schema/auth.js 的 '/api/auth/login' POST
 * username / password 必填字符串
 */
export class LoginDto {
  @IsDefined()
  @IsString()
  username: string;

  @IsDefined()
  @IsString()
  password: string;
}
