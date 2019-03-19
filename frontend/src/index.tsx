import ApolloClient, { InMemoryCache } from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import { render } from 'react-dom';

import { Root } from './containers/Root';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});

render(
  <ApolloProvider client={client}>
    <Root/>
  </ApolloProvider>,
  document.getElementById('root')
);
