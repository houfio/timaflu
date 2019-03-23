import { objectType } from 'yoga';

import { Order } from '../context';
import { execute } from '../utils/execute';

export const Invoice = objectType({
  name: 'Invoice',
  definition: (t) => {
    t.id('id');
    t.field('order', {
      type: 'Order',
      resolve: async ({ order_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM \`order\` o
          WHERE o.id = :order_id
        `;
        const result = await execute<Order>(db, query, { order_id });

        return result[0];
      }
    });
    t.field('state', {
      type: 'InvoiceState'
    });
    t.int('tax');
    t.string('date');
    t.list.field('lines', {
      type: 'InvoiceLine',
      resolve: ({ id }, args, { db }) => execute(db, `
        SELECT *
        FROM binned_product b
        WHERE b.invoice_id = :id
      `, { id })
    });
  }
});
