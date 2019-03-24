import { objectType } from 'yoga';

import { Contact, Invoice, OrderLine, User } from '../types';
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
            WHERE b.id = :billing_id
          )
        `;
        const result = await execute<User>(db, query, { billing_id });

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
            WHERE b.id = :billing_id
          )
        `;
        const result = await execute<Contact>(db, query, { billing_id });

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
        WHERE l.order_id = :id
      `, { id })
    });
    t.list.field('invoices', {
      type: 'Invoice',
      resolve: ({ id }, args, { db }) => execute<Invoice>(db, `
        SELECT *
        FROM invoice i
        WHERE i.order_id = :id
      `, { id })
    });
    t.float('total', {
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT round(sum(l.total * (1 - o.discount / 100)), 2) total
          FROM \`order\` o
            JOIN user_billing u ON o.billing_id = u.id
            JOIN order_line l ON o.id = l.order_id
          GROUP BY o.id
          HAVING o.id = :id
        `;
        const result = await execute<{ total: number }>(db, query, { id });

        return result[0].total;
      }
    });
    t.field('state', {
      type: 'InvoiceState',
      resolve: async ({ id }, args, { db }): Promise<any> => {
        const query = `
          SELECT min(i.state) state
          FROM invoice i
          GROUP BY i.order_id
          HAVING i.order_id = :id
        `;
        const result = await execute<{ state: number }>(db, query, { id });

        return result.length ? result[0].state : 0;
      }
    });
    t.int('days_left', {
      resolve: async ({ id }, args, { db }) => {
        const query = `
          SELECT ifnull(31 - datediff(now(), min(i.send_date)), 31) days_left
          FROM \`order\` o
            JOIN invoice i ON o.id = i.order_id AND i.state != 5 AND i.send_date
          WHERE o.id = :id;
        `;
        const result = await execute<{ days_left: number }>(db, query, { id });

        return result[0].days_left;
      }
    });
  }
});
