import { Injectable } from '@eastonshay/sara/dist/nest';
import { DatabaseProvider } from '@eastonshay/sara/dist/extend/database.provider';
import { StatusProvider } from '../common/status.provider';
import * as generator from 'generate-password';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


export interface UserItem {
  user_id: string;
  nickname: string;
  [key: string]: any;
}

export interface UserListQuery {
  username?: string;
  nickname?: string;
  sex?: number;
  createTimeStart?: string;
  createTimeEnd?: string;
}

const now = () => moment().format('YYYY-MM-DD HH:mm:ss');

/**
 * 对照 app/service/user.js
 */
@Injectable()
export class UserService {
  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly status: StatusProvider,
  ) {}

  /** 1.0 的 app.database：未配置 db 时为空，调用即抛错 → 全局异常兜底 50000 */
  private get database() {
    return this.databaseProvider.knex!;
  }

  async getByUsernameAndPassword({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<UserItem | undefined> {
    const res = await this.database('t_user')
      .select('*')
      .where({
        username,
        password,
        status: this.status.NORMAL,
      })
      .limit(1);

    return res[0];
  }

  async getUser(userId: string): Promise<UserItem | Record<string, never>> {
    const result = await this.database('t_user').select('*').where({
      user_id: userId,
      status: this.status.NORMAL,
    });

    return result[0] ?? {};
  }

  async createUser({
    username,
    nickname,
    desc,
    sex,
  }: {
    username?: string;
    nickname?: string;
    desc?: string;
    sex?: number;
  }): Promise<string> {
    const userId = uuidv4().replace(/-/g, '');
    const password = generator.generate({
      length: 8,
      numbers: true,
    });

    await this.database('t_user').insert({
      user_id: userId,
      username,
      password,
      nickname,
      desc,
      sex,
      status: this.status.NORMAL,
      create_time: now(),
    });

    return userId;
  }

  async updateUser(
    userId: string,
    { nickname, desc, sex }: { nickname?: string; desc?: string; sex?: number },
  ): Promise<string> {
    const updateObj: Record<string, unknown> = {};
    if (nickname) {
      updateObj.nickname = nickname;
    }
    if (desc) {
      updateObj.desc = desc;
    }
    if (sex) {
      updateObj.sex = sex;
    }

    await this.database('t_user')
      .update({
        ...updateObj,
        update_time: now(),
      })
      .where({
        user_id: userId,
      });

    return userId;
  }

  async deleteUser(userId: string): Promise<string> {
    await this.database('t_user')
      .update({
        status: this.status.DELETE,
        update_time: now(),
      })
      .where({
        user_id: userId,
      });

    return userId;
  }

  async getList({
    username,
    nickname,
    sex,
    createTimeStart,
    createTimeEnd,
    page,
    size,
  }: UserListQuery & { page: number; size: number }): Promise<UserItem[]> {
    let sql = this.database('t_user').select('*').where(this.buildWhere({ username, nickname, sex }));
    if (createTimeStart) {
      sql = sql.andWhere('create_time', '>=', createTimeStart);
    }
    if (createTimeEnd) {
      sql = sql.andWhere('create_time', '<', createTimeEnd);
    }
    sql = sql.offset((page - 1) * size).limit(size);

    return await sql;
  }

  async getListTotal({ username, nickname, sex, createTimeStart, createTimeEnd }: UserListQuery): Promise<number> {
    let sql = this.database('t_user')
      .countDistinct({ user_amount: 'user_id' })
      .where(this.buildWhere({ username, nickname, sex }));
    if (createTimeStart) {
      sql = sql.andWhere('create_time', '>=', createTimeStart);
    }
    if (createTimeEnd) {
      sql = sql.andWhere('create_time', '<', createTimeEnd);
    }

    const res = await sql;
    return Number(res[0]?.user_amount ?? 0);
  }

  private buildWhere({ username, nickname, sex }: Pick<UserListQuery, 'username' | 'nickname' | 'sex'>) {
    const queryObj: Record<string, unknown> = { status: this.status.NORMAL };
    if (username) {
      queryObj.username = username;
    }
    if (nickname) {
      queryObj.nickname = nickname;
    }
    // 保持 1.0 原样：`sex & sex !== -999` 是按位与（sex=2 / NaN 时不生效）
    if (sex! & Number(sex !== -999)) {
      queryObj.sex = sex;
    }
    return queryObj;
  }
}
