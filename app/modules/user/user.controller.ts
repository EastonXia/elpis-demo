import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query } from '@eastonshay/sara/dist/nest';
import { BaseController } from '@eastonshay/sara/dist/common/base/base.controller';
import moment from 'moment';
import { CreateUserDto, DeleteUserDto, GetUserDto, GetUserListDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

/**
 * 对照 app/controller/user.js + app/router/user.js
 * 路径与 1.0 一致：/api/proj/user、/api/proj/user/list
 */
@Controller('api/proj/user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  async getUser(@Query() query: GetUserDto) {
    const userItem: Record<string, any> = await this.userService.getUser(query.user_id);

    userItem.create_time = moment(userItem.create_time).format('YYYY-MM-DD HH:mm:ss');

    return this.success(userItem);
  }

  @Post()
  @HttpCode(200)
  async createUser(@Body() body: CreateUserDto) {
    const { username, nickname, desc, sex } = body;
    const userId = await this.userService.createUser({ username, nickname, desc, sex });

    return this.success({ user_id: userId });
  }

  @Put()
  async updateUser(@Body() body: UpdateUserDto) {
    const { user_id: userId, nickname, desc, sex } = body;
    const updateUserId = await this.userService.updateUser(userId, { nickname, desc, sex });

    return this.success({ user_id: updateUserId });
  }

  @Delete()
  async deleleUser(@Body() body: DeleteUserDto) {
    const deleteUserId = await this.userService.deleteUser(body.user_id);

    return this.success({ user_id: deleteUserId });
  }

  @Get('list')
  async getList(@Query() query: GetUserListDto) {
    const {
      username,
      nickname,
      sex,
      create_time_start: createTimeStart,
      create_time_end: createTimeEnd,
      page,
      size,
    } = query;

    const res = await Promise.all([
      this.userService.getList({
        username,
        nickname,
        sex: Number(sex),
        createTimeStart,
        createTimeEnd,
        page: Number(page),
        size: Number(size),
      }),
      this.userService.getListTotal({
        username,
        nickname,
        sex: Number(sex),
        createTimeStart,
        createTimeEnd,
      }),
    ]);

    if (!res[0]) {
      return this.success([], { total: 0 });
    }

    // 展示数据处理
    const resList = res[0];
    resList.forEach((item) => {
      item.sex = item.sex === 1 ? '男' : '女';
      item.create_time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
    });

    return this.success(resList, { total: res[1] });
  }
}
