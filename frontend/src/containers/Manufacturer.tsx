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

import { Products } from './Products';

type Params = {
  id: string
};

type Manufacturer = Identifiable & {
  id: number,
  contact: {
    company: string
  },
  products: [{
    name: string,
    price: number,
    description_short: string
  }]
};

type Products = Identifiable & {
  name: string,
  price: number,
  description_short: string
}

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
          name
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

          <Heading type="h2">
            Producten
          </Heading>

          <Table<Products>
            rows={data.manufacturer.products}
            columns={{
              name: [{
                heading: 'Naam'
              }],
              price: [{
                heading: 'Prijs',
                render: (value) => `€ ${value}`
              }],
              description_short: [{
                heading: 'Beschrijving'
              }]
            }}
          />

        </>
      ) : (
          <Redirect to="/manufacturers" />
        ) : (
          <Loading />
        )}
    </Content>
  );
}
