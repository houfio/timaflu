import { Connection } from 'mysql';

export type Context = {
  db: Connection
};

export type Product = {
  id: string,
  name: string,
  code: string
};
