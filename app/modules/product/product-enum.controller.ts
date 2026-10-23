import { Controller, Get, Req } from '@eastonshay/sara/dist/nest';
import { BaseController } from '@eastonshay/sara/dist/common/base/base.controller';
import type { ProjKeyRequest } from '@eastonshay/sara/dist/common/interceptors/proj-key.interceptor';
import { ProductService } from './product.service';

/**
 * 对照 app/router/business.js 的 /api/proj/product_enum/list
 * 前缀与 product 不同（product_enum），路径不能变，所以单独一个 Controller，仍在 ProductModule 内。
 */
@Controller('api/proj/product_enum')
export class ProductEnumController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get('list')
  getProductEnumList(@Req() req: ProjKeyRequest) {
    return this.success(this.productService.getProductEnumList(req.projKey!));
  }
}
