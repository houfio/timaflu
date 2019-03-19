import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { RouteComponentProps } from 'react-router';

import { Content } from '../components/Content';
import { Identifiable } from '../types';

import { Loading } from './Loading';

type Params = {
  id: string
};

type Product = Identifiable & {
  name: string
};

export function Product({ match: { params: { id } } }: RouteComponentProps<Params>) {
  const { loading, data } = useQuery<{
    product: Product
  }>(gql`
    query Product($id: ID!) {
      product(id: $id) {
        id
        name
      }
    }
  `, {
    variables: {
      id
    }
  });

  return (
    <Content title="Product">
      {!loading && data ? (
        <>
          {data.product.name}
        </>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
