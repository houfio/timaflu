import { Connection } from 'mysql';

export function execute<T>(connection: Connection, query: string, values?: object) {
  return new Promise<T[]>((resolve, reject) => connection.query(query, values, (err, results) => {
    if (err) {
      reject(err);
    }

    resolve(results);
  }));
}
