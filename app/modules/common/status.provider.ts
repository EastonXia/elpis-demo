import { Injectable } from '@eastonshay/sara/dist/nest';

/** 对照 app/extend/status.js */
@Injectable()
export class StatusProvider {
  readonly NORMAL = 1;
  readonly DELETE = -1;
}
