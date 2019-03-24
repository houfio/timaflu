import { Connection, createConnection } from 'mysql';

export type Context = {
  db: Connection
};

export default () => {
  const db = createConnection({
    host: 'databases.aii.avans.nl',
    database: 'bmgfrans_db',
    user: 'bmgfrans',
    password: 'Koolstof1'
  });

  db.config.queryFormat = (query, values) => !values ? query : query.replace(
    /:(\w+)/g,
    (txt, key) => !values.hasOwnProperty(key) ? txt : db.escape(values[key])
  );

  return {
    db
  };
};
