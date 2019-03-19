import { idArg, queryType, stringArg } from 'yoga';

import { execute } from '../utils/execute';

export const Query = queryType({
  definition: (t) => {
    t.field('product', {
      type: 'Product',
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = 'SELECT * FROM product WHERE id = ?';
        const result = await execute(db, query, [id]);

        return result[0];
      }
    });
    t.list.field('products', {
      type: 'Product',
      resolve: (root, args, { db }) => execute(db, 'SELECT * FROM product')
    });
  }
});
