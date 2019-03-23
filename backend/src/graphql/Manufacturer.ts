import { objectType, stringArg } from 'yoga';

import { Contact, Product } from '../context';
import { execute } from '../utils/execute';

export const Manufacturer = objectType({
  name: 'Manufacturer',
  definition: (t) => {
    t.id('id');
    t.field('contact', {
      type: 'Contact',
      resolve: async ({ contact_id }, args, { db }) => {
        const query = `
          SELECT *
          FROM contact c
          WHERE c.id = :contact_id
        `;
        const result = await execute<Contact>(db, query, { contact_id });

        return result[0];
      }
    });
    t.field('product', {
      type: 'Product',
      nullable: true,
      args: {
        name: stringArg()
      },
      resolve: async ({ id }, { name }, { db }) => {
        const query = `
          SELECT *
          FROM product p
          WHERE p.manufacturer_id = :id
            AND p.name = :name
        `;
        const result = await execute<Product>(db, query, { id, name });

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('products', {
      type: 'Product',
      resolve: ({ id }, args, { db }) => execute<Product>(db, `
        SELECT *
        FROM product p
        WHERE p.manufacturer_id = :id
      `, { id })
    });
  }
});
