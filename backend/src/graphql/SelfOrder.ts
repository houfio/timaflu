import { objectType } from 'yoga';

import { SelfOrderLine } from '../context';
import { execute } from '../utils/execute';

export const SelfOrder = objectType({
  name: 'SelfOrder',
  definition: (t) => {
    t.id('id');
    t.string('date');
    t.boolean('received');
    t.list.field('lines', {
      type: 'SelfOrderLine',
      resolve: ({ id }, args, { db }) => execute<SelfOrderLine>(db, `
        SELECT *
        FROM self_order_line l
        WHERE l.self_order_id = :id
      `, { id })
    });
  }
});
