import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

/** 对照 app/router-schema/business.js */

/** GET /api/proj/product/list */
export class GetProductListDto {
  // 1.0 schema 未声明 product_name，但 controller 读取它；DTO 白名单需要保留
  @IsOptional()
  @IsString()
  product_name?: string;

  @IsDefined()
  @IsString()
  page: string;

  @IsDefined()
  @IsString()
  size: string;
}

/** GET /api/proj/product */
export class GetProductDto {
  @IsDefined()
  @IsString()
  product_id: string;
}

/** POST /api/proj/product */
export class CreateProductDto {
  @IsDefined()
  @IsString()
  product_name: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  inventory?: number;
}

/** PUT /api/proj/product */
export class UpdateProductDto {
  @IsDefined()
  @IsString()
  product_id: string;

  @IsDefined()
  @IsString()
  product_name: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  inventory?: number;
}

/** DELETE /api/proj/product */
export class DeleteProductDto {
  @IsDefined()
  @IsString()
  product_id: string;
}
