import { idArg, queryType } from 'yoga';

import { execute } from '../utils/execute';

export const Query = queryType({
  definition: (t) => {
    t.field('product', {
      type: 'Product',
      nullable: true,
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = `SELECT * FROM product WHERE min_stock > 0 AND id = ?`;
        const result = await execute(db, query, [id]);

        return result[0];
      }
    });
    t.list.field('products', {
      type: 'Product',
      resolve: (root, { soldOnly }, { db }) => execute(db, `SELECT * FROM product WHERE min_stock > 0`)
    });
    t.list.field('manufacturers', {
      type: 'Manufacturer',
      args: {
        productId: idArg()
      },
      resolve: (root, { productId }, { db }) => {
        const subsub = `SELECT name FROM product WHERE id = ?`;
        const sub = `SELECT manufacturer_id FROM product WHERE name = (${subsub})`;
        const query = `SELECT * FROM manufacturer WHERE id IN (${sub})`;

        return execute(db, query, [productId]);
      }
    });
  }
});
