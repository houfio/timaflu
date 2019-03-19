import { objectType } from 'yoga';

import { execute } from '../utils/execute';

export const Manufacturer = objectType({
  name: 'Manufacturer',
  definition: (t) => {
    t.id('id');
    t.field('contact', {
      type: 'Contact',
      resolve: async ({ id }, args, { db }) => {
        const query = 'SELECT * FROM contact WHERE id = (SELECT contact_id FROM manufacturer WHERE id = ?)';
        const result = await execute(db, query, [id]);

        return result[0];
      }
    });
  }
});
