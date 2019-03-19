import * as express from 'express';
import { Server } from 'http';
import { createConnection } from 'mysql';
import { join } from 'path';
import { ApolloServer, makeSchema, yogaEject } from 'yoga';

import { Product } from './graphql/Product';
import { Query } from './graphql/Query';
import { connect } from './utils/connect';

export default yogaEject({
  async server() {
    const app = express();
    const schema = makeSchema({
      types: {
        Product,
        Query
      },
      outputs: {
        schema: join(__dirname, './schema.graphql'),
        typegen: join(__dirname, '../.yoga/nexus.ts')
      },
      typegenAutoConfig: {
        sources: [
          {
            source: join(__dirname, './types.ts'),
            alias: 'types'
          }
        ],
        contextType: 'types.Context'
      }
    });
    const db = createConnection({
      host: 'databases.aii.avans.nl',
      database: 'bmgfrans_db',
      user: 'bmgfrans',
      password: 'Koolstof1'
    });

    await connect(db);

    console.log('Connected to database');

    const server = new ApolloServer.ApolloServer({
      schema,
      context: {
        db
      }
    });

    server.applyMiddleware({
      app,
      path: '/'
    });

    return app;
  },
  async startServer(server) {
    return new Promise<Server>((resolve, reject) => {
      const http = server.listen({ port: 4000 }, () => {
        console.log(`Server ready at http://localhost:4000/`);

        resolve(http);
      }).on('error', reject);
    });
  },
  async stopServer(http) {
    return http.close();
  }
});
