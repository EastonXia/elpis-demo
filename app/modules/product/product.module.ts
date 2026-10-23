import { Module } from '@eastonshay/sara/dist/nest';
import { ProductEnumController } from './product-enum.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController, ProductEnumController],
  providers: [ProductService],
})
export class ProductModule {}
