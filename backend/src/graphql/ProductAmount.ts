import { objectType } from 'yoga';

import { Product } from '../types';
import { execute } from '../utils/execute';

export const ProductAmount = objectType({
  name: 'ProductAmount',
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
  }
});
