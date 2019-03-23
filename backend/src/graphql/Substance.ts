import { objectType } from 'yoga';

import { execute } from '../utils/execute';

export const Substance = objectType({
  name: 'Substance',
  definition: (t) => {
    t.id('id');
    t.string('name', {
      resolve: async ({ substance_id }, args, { db }) => {
        const query = `
          SELECT s.name
          FROM substance s
          WHERE s.id = :substance_id
        `;
        const result = await execute<{ name: string }>(db, query, { substance_id });

        return result[0].name;
      }
    });
    t.string('amount', {
      resolve: ({ quantity }) => quantity
    });
  }
});
