import { arg, idArg, intArg, queryType } from 'yoga';

import { Manufacturer, Order, Product, User } from '../context';
import { execute } from '../utils/execute';
import { Robot } from './Robot';

export const Query = queryType({
  definition: (t) => {
    t.field('user', {
      type: 'User',
      nullable: true,
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = `
          SELECT *
          FROM user u
          WHERE u.id = ?
        `;
        const result = await execute<User>(db, query, [id]);

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('users', {
      type: 'User',
      args: {
        role: arg({ type: 'UserRole', nullable: true })
      },
      resolve: (root, { role }, { db }) => execute<User>(db, role === undefined ? `
        SELECT *
        FROM user
      ` : `
        SELECT *
        FROM user u
        WHERE u.role = ?
      `, [role])
    });
    t.field('product', {
      type: 'Product',
      nullable: true,
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = `
          SELECT *
          FROM product p
          WHERE p.id = ?
        `;
        const result = await execute<Product>(db, query, [id]);

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('products', {
      type: 'Product',
      resolve: (root, args, { db }) => execute<Product>(db, `
        SELECT *
        FROM product
      `)
    });
    t.field('manufacturer', {
      type: 'Manufacturer',
      nullable: true,
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = `
          SELECT *
          FROM manufacturer m
          WHERE m.id = ?
        `;
        const result = await execute<Manufacturer>(db, query, [id]);

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('manufacturers', {
      type: 'Manufacturer',
      resolve: (root, args, { db }) => execute<Manufacturer>(db, `
        SELECT *
        FROM manufacturer
      `)
    });
    t.field('order', {
      type: 'Order',
      nullable: true,
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = `
          SELECT *
          FROM \`order\` o
          WHERE o.id = ?
        `;
        const result = await execute<Order>(db, query, [id]);

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('orders', {
      type: 'Order',
      resolve: (root, args, { db }) => execute<Order>(db, `
        SELECT *
        FROM \`order\`
      `)
    });
  }
});
