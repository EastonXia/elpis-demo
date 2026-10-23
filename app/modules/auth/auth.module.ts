import { Module } from '@eastonshay/sara/dist/nest';
import { APP_GUARD } from '@eastonshay/sara/dist/nest';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthTokenGuard } from './auth-token.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [{ provide: APP_GUARD, useClass: AuthTokenGuard }],
})
export class AuthModule {}
