import { objectType } from 'yoga';

import { Product, SelfOrder } from '../context';
import { execute } from '../utils/execute';

export const SelfOrderLine = objectType({
  name: 'SelfOrderLine',
  definition: (t) => {
    t.id('id');
    t.field('product', {
      type: 'Product',
      resolve: async ({ product_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM product p
          WHERE p.id = :product_id
        `;
        const result = await execute<Product>(db, query, { product_id });

        return result[0];
      }
    });
    t.field('order', {
      type: 'SelfOrder',
      resolve: async ({ self_order_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM self_order o
          WHERE o.id = :self_order_id
        `;
        const result = await execute<SelfOrder>(db, query, { self_order_id });

        return result[0];
      }
    });
    t.int('amount');
    t.float('total');
  }
});
