import { Connection } from 'mysql';

export function connect(connection: Connection) {
  return new Promise((resolve, reject) => connection.connect((err) => err ? reject(err) : resolve()));
}
