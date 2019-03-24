import { objectType } from 'yoga';

import { User } from '../types';
import { execute } from '../utils/execute';

export const QueueLine = objectType({
  name: 'QueueLine',
  definition: (t) => {
    t.id('id');
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
    t.field('user', {
      type: 'User',
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT *
          FROM user u
          WHERE u.id IN (
            SELECT b.user_id
            FROM \`order\` o
              JOIN invoice i on o.id = i.order_id
              JOIN user_billing b on o.billing_id = b.id
            WHERE i.id = :id
          );
        `;
        const result = await execute<User>(db, query, { id });

        return result[0];
      }
    });
  }
});
