import { SetMetadata } from '@eastonshay/sara/dist/nest';

/** 标记无需登录即可访问的 handler / controller；AuthTokenGuard 认这个元数据 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
