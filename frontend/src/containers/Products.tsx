import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Table } from '../components/Table';
import { Identifiable } from '../types';

import { Loading } from './Loading';

type Product = Identifiable & {
  name: string,
  code: string
};

export function Products() {
  const { loading, data } = useQuery<{
    products: Product[]
  }>(gql`
    query {
      products {
        id
        name
        code
      }
    }
  `);

  return (
    <Content title="Producten">
      {!loading && data ? (
        <Table<Product>
          rows={data.products}
          columns={{
            id: {
              heading: 'ID'
            },
            name: {
              heading: 'Naam'
            },
            code: {
              heading: 'Code'
            }
          }}
          onClick={console.log}
        />
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
