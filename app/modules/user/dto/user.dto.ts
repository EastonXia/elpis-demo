import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

/** 对照 app/router-schema/user.js */

/** GET /api/proj/user/list */
export class GetUserListDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsString()
  create_time_start?: string;

  @IsOptional()
  @IsString()
  create_time_end?: string;

  @IsDefined()
  @IsString()
  page: string;

  @IsDefined()
  @IsString()
  size: string;
}

/** GET /api/proj/user */
export class GetUserDto {
  @IsDefined()
  @IsString()
  user_id: string;
}

/** POST /api/proj/user */
export class CreateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumber()
  sex?: number;
}

/** PUT /api/proj/user */
export class UpdateUserDto {
  @IsDefined()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumber()
  sex?: number;
}

/** DELETE /api/proj/user（1.0 schema 与 PUT 同形） */
export class DeleteUserDto extends UpdateUserDto {}
