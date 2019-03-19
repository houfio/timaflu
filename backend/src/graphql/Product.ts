import { objectType } from 'yoga';

import { execute } from '../utils/execute';

export const Product = objectType({
  name: 'Product',
  definition: (t) => {
    t.id('id');
    t.string('name');
    t.string('code');
    t.float('price');
    t.string('description', { nullable: true });
    t.string('description_short', { nullable: true });
    t.int('stock', { nullable: true });
    t.int('min_stock', { nullable: true });
    t.string('contents', { nullable: true });
    t.string('location', { nullable: true });
    t.string('packaging', { nullable: true });
    t.string('packaging_amount', { nullable: true });
    t.string('packaging_size', { nullable: true });
    t.string('min_order', { nullable: true });
    t.string('sold_since', { nullable: true });
    t.field('manufacturer', {
      type: 'Manufacturer',
      resolve: async ({ id }, args, { db }) => {
        const query = 'SELECT * FROM manufacturer WHERE id = (SELECT manufacturer_id FROM product WHERE id = ?)';
        const result = await execute(db, query, [id]);

        return result[0];
      }
    });
  }
});
