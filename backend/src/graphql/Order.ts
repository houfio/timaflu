import { objectType } from 'yoga';

import { Contact, Invoice, OrderLine, User } from '../context';
import { execute } from '../utils/execute';

export const Order = objectType({
  name: 'Order',
  definition: (t) => {
    t.id('id');
    t.field('user', {
      type: 'User',
      resolve: async ({ billing_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM user u
          WHERE u.id = (
            SELECT b.user_id
            FROM user_billing b
            WHERE b.id = ?
          )
        `;
        const result = await execute<User>(db, query, [billing_id]);

        return result[0];
      }
    });
    t.field('contact', {
      type: 'Contact',
      resolve: async ({ billing_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM contact c
          WHERE c.id = (
            SELECT b.contact_id
            FROM user_billing b
            WHERE b.id = ?
          )
        `;
        const result = await execute<Contact>(db, query, [billing_id]);

        return result[0];
      }
    });
    t.string('description', { nullable: true });
    t.string('date');
    t.int('discount');
    t.list.field('lines', {
      type: 'OrderLine',
      resolve: ({ id }, args, { db }) => execute<OrderLine>(db, `
        SELECT *
        FROM order_line l
        WHERE l.order_id = ?
      `, [id])
    });
    t.list.field('invoices', {
      type: 'Invoice',
      resolve: ({ id }, args, { db }) => execute<Invoice>(db, `
        SELECT *
        FROM invoice i
        WHERE i.order_id = ?
      `, [id])
    });
    t.float('total', {
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT round(sum(l.total * (1 - o.discount / 100) * (1 + i.tax / 100)), 2) total
          FROM \`order\` o
            JOIN user_billing u ON o.billing_id = u.id
            JOIN order_line l ON o.id = l.order_id
            JOIN invoice i ON o.id = i.order_id
          GROUP BY o.id
          HAVING o.id = ?
          LIMIT 1;
        `;
        const result = await execute<{ total: number }>(db, query, [id]);

        return result[0].total;
      }
    });
  }
});
