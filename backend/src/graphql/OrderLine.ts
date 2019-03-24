import { objectType } from 'yoga';

import { Order, Product } from '../types';
import { execute } from '../utils/execute';

export const OrderLine = objectType({
  name: 'OrderLine',
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
      type: 'Order',
      resolve: async ({ order_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM \`order\` o
          WHERE o.id = :order_id
        `;
        const result = await execute<Order>(db, query, { order_id });

        return result[0];
      }
    });
    t.int('amount');
    t.string('description', { nullable: true });
    t.int('total');
  }
});
