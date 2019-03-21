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
    t.list.field('substances', {
      type: 'Substance',
      resolve: ({ id }, args, { db }) => execute(db, `
        SELECT *
        FROM substance s
        WHERE s.id IN (
          SELECT p.substance_id
          FROM product_substance p
          WHERE p.product_id = :id
        )
      `, { id })
    });
  }
});
