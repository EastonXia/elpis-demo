module.exports = (app) => {
  const moment = require('moment');
  const BaseController = require('@eastonshay/love-elpis').Controller.Base(app);

  return class UserController extends BaseController {
    async getUser(ctx) {
      const { user_id: userId } = ctx.request.query;

      const { user: userService } = app.service;
      const userItem = await userService.getUser(userId);

      userItem.create_time = moment(userItem.create_time).format('YYYY-MM-DD HH:mm:ss');

      this.success(ctx, userItem);

    }

    async createUser(ctx) {
      const {
        username,
        nickname,
        desc,
        sex,
      } = ctx.request.body;
      
      const { user: userService } = app.service;
      const userId = await userService.createUser({
        username,
        nickname,
        desc,
        sex,
      })

      this.success(ctx, { user_id: userId })
    }

    async updateUser(ctx) {
      const {
        user_id: userId,
        nickname,
        desc,
        sex,
      } = ctx.request.body;

      const { user: userService } = app.service;
      const updateUserId = await userService.updateUser(userId, {
        nickname,
        desc,
        sex,
      })

      this.success(ctx, { user_id: updateUserId })
    }

    async deleleUser(ctx) {
      const {
        user_id: userId,
      } = ctx.request.body;

      const { user: userService } = app.service;
      const deleteUserId = await userService.deleteUser(userId)

      this.success(ctx, { user_id: deleteUserId })
    }

    async getList(ctx) {
      const {
        username,
        nickname,
        sex,
        create_time_start: createTimeStart,
        create_time_end: createTimeEnd,
        page,
        size
      } = ctx.request.query;

      const { user: userService } = app.service;

      const jobs = [];
      jobs.push(userService.getList({
        username,
        nickname,
        sex: Number(sex),
        createTimeStart,
        createTimeEnd,
        page: Number(page),
        size: Number(size)
      }))
      jobs.push(userService.getListTotal({
        username,
        nickname,
        sex: Number(sex),
        createTimeStart,
        createTimeEnd,
      }))

      const res = await Promise.all(jobs);

      if(!res[0] || res.length < 0) {
        return this.success(ctx, [], {
          total: 0
        })
      }

      // 展示数据处理
      const resList = res[0];
      resList.forEach(item => {
        item.sex = item.sex === 1 ? '男' : '女';
        item.create_time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
      })
      const total = res[1]

      this.success(ctx, resList, {
        total
      })
    }
  }
}