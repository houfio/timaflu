import styled from '@emotion/styled/macro';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { RouteComponentProps } from 'react-router';

import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Row } from '../components/Row';
import { Table } from '../components/Table';
import { Breakpoint, Identifiable } from '../types';

import { Loading } from './Loading';

type Params = {
  id: string
};

type Product = Identifiable & {
  name: string,
  description: string,
  stock: number,
  min_stock: number,
  sold_since: string,
  manufacturer: {
    contact: {
      company: string
    }
  }
};

type Manufacturer = Identifiable & {
  contact: {
    company: string
  }
};

export function Product({ match: { params: { id } } }: RouteComponentProps<Params>) {
  const { loading, data } = useQuery<{
    product: Product,
    manufacturers: Manufacturer[]
  }>(gql`
    query Product($id: ID!) {
      product(id: $id) {
        id
        name
        description
        stock
        min_stock
        sold_since
        manufacturer {
          contact {
            company
          }
        }
      }
      manufacturers(productId: $id) {
        id
        contact {
          company
        }
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
          <Heading type="h1">
            {data.product.name}
          </Heading>
          <StyledDescription>
            {data.product.description}
          </StyledDescription>
          <Row>
            <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
              <Heading type="h2">
                Productinformatie
              </Heading>
              <Heading type="h3">
                Algemene informatie over dit product
              </Heading>
              <StyledInfo>
                <span>Voorraad: {data.product.stock}</span>
                <span>Minimale voorraad: {data.product.min_stock}</span>
                <span>Verkocht sinds: {format(Number(data.product.sold_since), 'PPPP', { locale: nl })}</span>
                <span>Huidige fabrikant: {data.product.manufacturer.contact.company}</span>
              </StyledInfo>
            </Column>
            <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
              <Heading type="h2">
                Fabrikanten
              </Heading>
              <Heading type="h3">
                Fabrikanten van dit product
              </Heading>
              <Table<Manufacturer>
                rows={data.manufacturers}
                columns={{
                  id: {
                    heading: 'ID'
                  },
                  contact: {
                    heading: 'Bedrijfsnaam',
                    render: (value) => value.company
                  }
                }}
              />
            </Column>
          </Row>
        </>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}

const StyledDescription = styled.div`
  margin-bottom: 2rem;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;
