import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';

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
      {!loading && data ? data.product ? (
        <>
          <Heading type="h1">
            {data.product.name}
          </Heading>
          <Heading type="h3">
            Product {codeFormat(data.product.id)}
          </Heading>
        </>
      ) : (
        <Redirect to="/products"/>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
