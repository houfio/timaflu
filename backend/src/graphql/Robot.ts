import { objectType } from 'yoga';

import { Invoice } from '../types';
import { execute } from '../utils/execute';

export const Robot = objectType({
  name: 'Robot',
  definition: (t) => {
    t.id('id');
    t.string('code');
    t.field('collecting', {
      type: 'Invoice',
      nullable: true,
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT *
          FROM invoice i
          WHERE i.id IN (
            SELECT b.invoice_id
            FROM binned_product b
            WHERE i.id = b.invoice_id
              AND b.robot_id = :id
          ) AND i.state = 1
        `;
        const result = await execute<Invoice>(db, query, { id });

        return result.length ? result[0] : undefined!;
      }
    });
  }
});
