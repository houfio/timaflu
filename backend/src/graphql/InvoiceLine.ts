import { objectType } from 'yoga';

import { Bin, Invoice, Product, Robot } from '../types';
import { execute } from '../utils/execute';

export const InvoiceLine = objectType({
  name: 'InvoiceLine',
  definition: (t) => {
    t.id('id');
    t.field('bin', {
      type: 'Bin',
      resolve: async ({ bin_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM bin b
          WHERE b.id = :bin_id
        `;
        const result = await execute<Bin>(db, query, { bin_id });

        return result[0];
      }
    });
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
    t.field('invoice', {
      type: 'Invoice',
      resolve: async ({ invoice_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM invoice i
          WHERE i.id = :invoice_id
        `;
        const result = await execute<Invoice>(db, query, { invoice_id });

        return result[0];
      }
    });
    t.field('robot', {
      type: 'Robot',
      resolve: async ({ robot_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM robot r
          WHERE r.id = :robot_id
        `;
        const result = await execute<Robot>(db, query, { robot_id });

        return result[0];
      }
    });
    t.int('amount');
  }
});
