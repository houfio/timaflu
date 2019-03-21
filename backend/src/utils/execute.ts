import { Connection } from 'mysql';

export function execute<T extends object>(
  connection: Connection,
  query: string,
  values?: { [key: string]: unknown }
) {
  return new Promise<T[]>((resolve, reject) => connection.query(query, values || {}, (err, results) => {
    if (err) {
      reject(err);
    }

    resolve(results);
  }));
}
