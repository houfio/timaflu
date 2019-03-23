import { objectType } from 'yoga';

import { Manufacturer } from '../context';
import { execute } from '../utils/execute';

export const Product = objectType({
  name: 'Product',
  definition: (t) => {
    t.id('id');
    t.field('manufacturer', {
      type: 'Manufacturer',
      resolve: async ({ manufacturer_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM manufacturer m
          WHERE m.id = :manufacturer_id
        `;
        const result = await execute<Manufacturer>(db, query, { manufacturer_id });

        return result[0];
      }
    });
    t.string('name');
    t.string('code');
    t.float('price');
    t.float('sell_price', { nullable: true });
    t.string('description', { nullable: true });
    t.string('description_short', { nullable: true });
    t.int('stock', { nullable: true });
    t.int('min_stock', { nullable: true });
    t.string('contents', { nullable: true });
    t.string('location', { nullable: true });
    t.int('packaging', { nullable: true });
    t.int('packaging_amount', { nullable: true });
    t.int('packaging_size', { nullable: true });
    t.string('min_order', { nullable: true });
    t.string('sold_since', { nullable: true });
    t.list.field('substances', {
      type: 'Substance',
      resolve: ({ id }, args, { db }) => execute(db, `
        SELECT *
        FROM product_substance s
        WHERE s.product_id = :id
      `, { id })
    });
    t.field('state', {
      type: 'ProductState',
      resolve: ({ stock, min_stock }) => {
        if (!stock || !min_stock) {
          return 'ZERO';
        } else if (stock < min_stock / 2) {
          return 'FAR_BELOW_MIN';
        } else if (stock < min_stock) {
          return 'BELOW_MIN';
        } else if (stock >= min_stock * 2) {
          return 'FAR_ABOVE_MIN';
        }

        return 'ABOVE_MIN';
      }
    });
  }
});
