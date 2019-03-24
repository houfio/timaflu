import styled from '@emotion/styled/macro';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Button } from '../components/Button';
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
    company: string,
    first_name: string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    telephone: string,
    website: string
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
          first_name
          last_name
          address
          postal_code
          city
          country
          telephone
          website
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
          <StyledDescription>
            Contactpersoon: {data.manufacturer.contact.first_name} {data.manufacturer.contact.last_name}
          </StyledDescription>
          <StyledBox>
            <Heading type="h2">
              Informatie
            </Heading>
            <span>{data.manufacturer.contact.company}</span>
            <span>{data.manufacturer.contact.address}</span>
            <span>{data.manufacturer.contact.postal_code} {data.manufacturer.contact.city}</span>
            <span>{data.manufacturer.contact.country}</span>
            <span>{data.manufacturer.contact.telephone}</span>
            <StyledWebsite>
              <Button onClick={() => window.location.assign(data.manufacturer.contact.website)}>
                Website
              </Button>
            </StyledWebsite>
          </StyledBox>
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
            heading="Producten"
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

const StyledDescription = styled.span`
  display: block;
  margin: 1.5rem 0 1rem;
  max-width: 50rem;
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
  height: 100%;
`;

const StyledWebsite = styled.div`
  margin-top: 1rem;
`;
