import { queryType, stringArg } from 'yoga';

import { Product } from '../types';
import { execute } from '../utils/execute';

export const Query = queryType({
  definition: (t) => {
    t.list.field('products', {
      type: 'Product',
      resolve: async (root, args, { db }) => {
        return execute<Product>(db, 'SELECT * FROM product');
      }
    });
  }
});
