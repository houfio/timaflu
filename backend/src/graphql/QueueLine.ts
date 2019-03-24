import { objectType } from 'yoga';

import { Invoice } from '../types';
import { execute } from '../utils/execute';

export const QueueLine = objectType({
  name: 'QueueLine',
  definition: (t) => {
    t.id('id');
    t.field('invoice', {
      type: 'Invoice',
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT *
          FROM invoice i
          WHERE i.id = :id
        `;
        const result = await execute<Invoice>(db, query, { id });

        return result[0];
      }
    });
    t.list.field('bins', {
      type: 'Bin',
      resolve: ({ id }, args, { db }) => execute(db, `
        SELECT *
        FROM bin b
        WHERE b.id IN (
          SELECT p.bin_id
          FROM binned_product p
          WHERE p.invoice_id = :id
        );
      `, { id })
    });
  }
});
