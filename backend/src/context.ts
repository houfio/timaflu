import { Connection, createConnection } from 'mysql';

export type Context = {
  db: Connection
};

export default () => ({
  db: createConnection({
    host: 'databases.aii.avans.nl',
    database: 'bmgfrans_db',
    user: 'bmgfrans',
    password: 'Koolstof1'
  })
});
