import { objectType } from 'yoga';

import { Contact, Order } from '../context';
import { execute } from '../utils/execute';

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.id('id');
    t.field('role', {
      type: 'UserRole'
    });
    t.field('contact', {
      type: 'Contact',
      resolve: async ({ contact_id }, args, { db }) => {
        const query = `
          SELECT * FROM contact c WHERE c.id = ?
        `;
        const result = await execute<Contact>(db, query, [contact_id]);

        return result[0];
      }
    });
    t.list.field('billing', {
      type: 'Contact',
      resolve: ({ id }, args, { db }) => execute<Contact>(db, `
        SELECT *
        FROM contact c
        WHERE c.id IN (
          SELECT b.contact_id
          FROM user_billing b
          WHERE b.user_id = ?
        )
      `, [id])
    });
    t.list.field('orders', {
      type: 'Order',
      resolve: ({ id }, args, { db }) => execute<Order>(db, `
        SELECT *
        FROM \`order\` o
        WHERE o.billing_id IN (
          SELECT b.id
          FROM user_billing b
          WHERE b.user_id = ?
        )
      `, [id])
    });
  }
});
