import ApolloClient, { InMemoryCache } from 'apollo-boost';
import 'normalize.css';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
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
