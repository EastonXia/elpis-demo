import { Injectable } from '@eastonshay/sara/dist/nest';

export interface ProductItem {
  product_id: string;
  product_name: string;
  price: number;
  inventory: number;
  create_time: string;
}

/** 对照 app/controller/business.js 里的数据与 sleep（Service 不碰 ctx / req） */
@Injectable()
export class ProductService {
  sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), Math.random() * time);
    });
  }

  getProductList(projKey: string): ProductItem[] {
    return [
      {
        product_id: '1',
        product_name: `${projKey} - 大前端面试宝典`,
        price: 39.9,
        inventory: 99999,
        create_time: '2023-07-03 20:22:12',
      },
      {
        product_id: '2',
        product_name: `${projKey} - 前端求职之道`,
        price: 199,
        inventory: 99999,
        create_time: '2023-07-03 20:33:44',
      },
      {
        product_id: '3',
        product_name: `${projKey} - 大前端全栈实践`,
        price: 699,
        inventory: 99999,
        create_time: '2024-11-03 14:22:52',
      },
    ];
  }

  getProductEnumList(projKey: string): Array<{ label: string; value: string }> {
    return [
      { label: '全部', value: 'all' },
      { label: `${projKey} - 大前端面试宝典`, value: `${projKey} - 大前端面试宝典` },
      { label: `${projKey} - 前端求职之道`, value: `${projKey} - 前端求职之道` },
      { label: `${projKey} - 大前端全栈实践`, value: `${projKey} - 大前端全栈实践` },
    ];
  }
}
