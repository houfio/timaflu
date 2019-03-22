import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { useRouter } from '../hooks/useRouter';
import { Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';

import { Products } from './Products';

type Params = {
  id: string
};

type Products = Identifiable & {
  name: string,
  code: string,
  price: number,
  description_short: string
};

type Manufacturer = Identifiable & {
  id: number,
  contact: {
    company: string
  },
  products: Products[]
};

export function Manufacturer({ match: { params: { id } } }: RouteComponentProps<Params>) {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    manufacturer: Manufacturer
  }>(gql`
    query Manufacturer($id: ID!) {
      manufacturer(id: $id) {
        id
        contact {
          company
        }
        products {
          id
          name
          code
          price
          description_short
        }
      }
    }
  `, {
    variables: {
      id
    }
  });

  return (
    <Content title="Fabrikant">
      {!loading && data ? data.manufacturer ? (
        <>
          <Heading type="h1">
            {data.manufacturer.contact.company}
          </Heading>
          <Heading type="h3">
            Fabrikant {codeFormat(data.manufacturer.id)}
          </Heading>
          <Table<Products>
            rows={data.manufacturer.products}
            columns={{
              name: [{
                heading: 'Naam'
              }],
              code: [{
                heading: 'Code',
                render: codeFormat
              }],
              price: [{
                heading: 'Prijs',
                render: priceFormat
              }],
              description_short: [{
                heading: 'Beschrijving'
              }]
            }}
            onClick={({ id: productId }) => history.push(`/products/${productId}`)}
          />
        </>
      ) : (
        <Redirect to="/manufacturers"/>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
