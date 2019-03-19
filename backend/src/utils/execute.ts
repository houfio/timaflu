import { Connection } from 'mysql';

export function execute<T = any>(connection: Connection, query: string, values?: string[]) {
  return new Promise<T[]>((resolve, reject) => connection.query(query, values, (err, results) => {
    if (err) {
      reject(err);
    }

    resolve(results);
  }));
}
