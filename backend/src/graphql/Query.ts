import { arg, booleanArg, idArg, intArg, queryType, stringArg } from 'yoga';

import { Manufacturer, Order, Product, SelfOrder, User } from '../context';
import { execute } from '../utils/execute';

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
          WHERE u.id = :id
        `;
        const result = await execute<User>(db, query, { id });

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('users', {
      type: 'User',
      args: {
        search: stringArg({ nullable: true }),
        limit: intArg({ nullable: true }),
        role: arg({ type: 'UserRole', nullable: true })
      },
      resolve: (root, { search = '', limit, role }, { db }) => execute<User>(db, `
        SELECT *
        FROM user u
        WHERE (u.contact_id IN (
          SELECT c.id
          FROM contact c
          WHERE concat(c.first_name, ' ', c.last_name) LIKE :search OR c.company LIKE :search
        ) OR u.id IN (
          SELECT b.user_id
          FROM user_billing b
            JOIN contact c ON b.contact_id = c.id
          WHERE b.user_id = u.id AND (concat(c.first_name, ' ', c.last_name) LIKE :search OR c.company LIKE :search)
        ))
        ${role !== undefined ? `
          AND u.role = :role
        ` : ''}
        ${limit !== undefined ? `
          LIMIT :limit
        ` : ''}
      `, { search: `%${search}%`, limit, role })
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
          WHERE p.id = :id
        `;
        const result = await execute<Product>(db, query, { id });

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('products', {
      type: 'Product',
      args: {
        search: stringArg({ nullable: true }),
        limit: intArg({ nullable: true }),
        sold: booleanArg({ nullable: true })
      },
      resolve: (root, { search = '', limit, sold }, { db }) => execute<Product>(db, `
        SELECT *
        FROM product p
        WHERE p.name LIKE :search
        ${sold !== undefined ? sold ? `
          AND p.min_stock > 0
        ` : `
          AND (p.min_stock IS NULL OR p.min_stock = 0)
        ` : ''}
        ${limit !== undefined ? `
          LIMIT :limit
        ` : ''}
      `, { search: `%${search}%`, limit })
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
          WHERE m.id = :id
        `;
        const result = await execute<Manufacturer>(db, query, { id });

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('manufacturers', {
      type: 'Manufacturer',
      args: {
        search: stringArg({ nullable: true }),
        limit: intArg({ nullable: true }),
        product: idArg({ nullable: true })
      },
      resolve: (root, { search = '', limit, product }, { db }) => execute<Manufacturer>(db, `
        SELECT *
        FROM manufacturer m
        WHERE (
          SELECT c.company
          FROM contact c
          WHERE m.contact_id = c.id
        ) LIKE :search
        ${product ? `
          AND m.id IN (
            SELECT p.manufacturer_id
            FROM product p
              JOIN product m ON m.id = :product
            WHERE p.name = m.name
          )
        ` : ''}
        ${limit !== undefined ? `
          LIMIT :limit
        ` : ''}
      `, { search: `%${search}%`, limit, product })
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
          WHERE o.id = :id
        `;
        const result = await execute<Order>(db, query, { id });

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
    t.field('selfOrder', {
      type: 'SelfOrder',
      nullable: true,
      args: {
        id: idArg()
      },
      resolve: async (root, { id }, { db }) => {
        const query = `
          SELECT *
          FROM self_order o
          WHERE o.id = :id
        `;
        const result = await execute<SelfOrder>(db, query, { id });

        return result.length ? result[0] : undefined!;
      }
    });
    t.list.field('selfOrders', {
      type: 'SelfOrder',
      resolve: (root, args, { db }) => execute<SelfOrder>(db, `
        SELECT *
        FROM self_order
      `)
    });
  }
});
