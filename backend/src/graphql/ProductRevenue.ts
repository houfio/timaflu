import { objectType } from 'yoga';

import { Product } from '../types';
import { execute } from '../utils/execute';

export const ProductRevenue = objectType({
  name: 'ProductRevenue',
  definition: (t) => {
    t.id('id');
    t.field('product', {
      type: 'Product',
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT *
          FROM product p
          WHERE p.id = :id
        `;
        const result = await execute<Product>(db, query, { id });

        return result[0];
      }
    });
    t.int('amount');
    t.float('revenue');
    t.float('profit');
  }
});
