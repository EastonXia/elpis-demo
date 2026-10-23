import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Req } from '@eastonshay/sara/dist/nest';
import { BaseController } from '@eastonshay/sara/dist/common/base/base.controller';
import type { ProjKeyRequest } from '@eastonshay/sara/dist/common/interceptors/proj-key.interceptor';
import {
  CreateProductDto,
  DeleteProductDto,
  GetProductDto,
  GetProductListDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

/**
 * 对照 app/controller/business.js + app/router/business.js
 * 路径与 1.0 一致：/api/proj/product、/api/proj/product/list
 * projKey 由框架全局 ProjKeyInterceptor 挂到 req.projKey
 */
@Controller('api/proj/product')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get()
  async get(@Query() query: GetProductDto, @Req() req: ProjKeyRequest) {
    await this.productService.sleep(500);
    const productList = this.productService.getProductList(req.projKey!);
    const productItem = productList.find((item) => item.product_id === query.product_id);

    return this.success(productItem);
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: CreateProductDto) {
    const { product_name: productName, price, inventory } = body;
    await this.productService.sleep(500);

    return this.success({
      product_id: Date.now(),
      product_name: productName,
      price,
      inventory,
    });
  }

  @Put()
  async update(@Body() body: UpdateProductDto) {
    const { product_id: productId, product_name: productName, price, inventory } = body;
    await this.productService.sleep(500);

    return this.success({
      product_id: productId,
      product_name: productName,
      price,
      inventory,
    });
  }

  @Delete()
  async remove(@Body() body: DeleteProductDto, @Req() req: ProjKeyRequest) {
    await this.productService.sleep(500);

    return this.success({
      projKey: req.projKey,
      product_id: body.product_id,
    });
  }

  @Get('list')
  async getList(@Query() query: GetProductListDto, @Req() req: ProjKeyRequest) {
    const { product_name: productName, page, size } = query;
    await this.productService.sleep(500);
    let productList = this.productService.getProductList(req.projKey!);

    if (productName && productName !== 'all') {
      productList = productList.filter((item) => item.product_name === productName);
    }

    return this.success(productList, {
      total: productList.length,
      page,
      size,
    });
  }
}
