import { Module } from '@eastonshay/sara/dist/nest';
import { ExtendModule } from '@eastonshay/sara/dist/extend/extend.module';
import { StatusProvider } from '../common/status.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ExtendModule],
  controllers: [UserController],
  providers: [UserService, StatusProvider],
  exports: [UserService],
})
export class UserModule {}
