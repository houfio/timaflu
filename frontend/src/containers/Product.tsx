import styled from '@emotion/styled/macro';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Button } from '../components/Button';
import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Row } from '../components/Row';
import { Table } from '../components/Table';
import { useRouter } from '../hooks/useRouter';
import { Breakpoint, Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';

type Params = {
  id: string
};

type Substances = Identifiable & {
  name: string,
  amount: string
};

type Product = Identifiable & {
  id: number,
  name: string,
  code: string,
  price: number,
  description?: string,
  min_stock?: number,
  stock?: number,
  contents?: string,
  packaging?: string,
  packaging_amount?: string,
  packaging_size?: string,
  sold_since?: string,
  substances: Substances[]
  manufacturer: {
    id: number,
    contact: {
      company: string,
      address: string,
      postal_code: string,
      city: string,
      country: string,
      telephone: string,
      website: string
    }
  }
};

export function Product({ match: { params: { id } } }: RouteComponentProps<Params>) {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    product: Product
  }>(gql`
    query Product($id: ID!) {
      product(id: $id) {
        id
        name
        code
        price
        description
        min_stock
        stock
        contents
        packaging
        packaging_amount
        packaging_size
        sold_since
        substances {
          id
          name
          amount
        }
        manufacturer{
          id
          contact {
            company
            address
            postal_code
            city
            country
            telephone
            website
          }
        }
      }
    }
  `, {
    variables: {
      id
    }
  });

  const fallback = (value: unknown) => value !== null ? value : 'Onbekend';

  return (
    <Content title="Product">
      {!loading && data ? data.product ? (
        <>
          <Heading type="h1">
            {data.product.name}
          </Heading>
          <Heading type="h3">
            Product {codeFormat(data.product.code)}
          </Heading>
          <StyledDescription>
            {data.product.description || (
              <FontAwesomeIcon icon={faMinus} color="rgba(0, 0, 0, .1)"/>
            )}
            <br/>
            {data.product.sold_since ? (
              <span>Verkocht sinds {format(Number(data.product.sold_since), 'PPPP', { locale: nl })}</span>
            ) : (
              <span>Dit product wordt momenteel niet verkocht</span>
            )}
          </StyledDescription>
          <StyledRow spacing={1}>
            <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
              <StyledContact>
                <Heading type="h2">
                  Informatie
                </Heading>
                <span>Prijs: {data.product.price ? priceFormat(data.product.price) : 'Onbekend'}</span>
                <span>Huidige voorraad: {data.product.stock || 0}</span>
                <span>Minimale voorraad: {data.product.min_stock || 0}</span>
                <span>Gewicht: {fallback(data.product.contents)}</span>
                <span>Verpakking: {fallback(data.product.packaging)}</span>
                <span>Hoeveelheid: {fallback(data.product.packaging_amount)}</span>
                <span>Verpakkingsformaat: {fallback(data.product.packaging_size)}</span>
              </StyledContact>
            </Column>
            <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
              <StyledContact>
                <Heading type="h2" onClick={() => history.push(`/manufacturers/${data.product.manufacturer.id}`)}>
                  Fabrikant
                </Heading>
                <span>{data.product.manufacturer.contact.company}</span>
                <span>{data.product.manufacturer.contact.address}, {data.product.manufacturer.contact.city}</span>
                <span>{data.product.manufacturer.contact.postal_code}</span>
                <span>{data.product.manufacturer.contact.country}</span>
                <span>{data.product.manufacturer.contact.telephone}</span>
                <StyledWebsite>
                  <Button onClick={() => window.location.assign(data.product.manufacturer.contact.website)}>
                    Website
                  </Button>
                </StyledWebsite>
              </StyledContact>
            </Column>
          </StyledRow>
          <Table<Substances>
            rows={data.product.substances}
            columns={{
              name: [{
                heading: 'Naam'
              }],
              amount: [{
                heading: 'Hoeveelheid'
              }]
            }}
            heading="Stoffen"
          />
        </>
      ) : (
        <Redirect to="/products"/>
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

const StyledRow = styled(Row)`
  padding: 1rem 0;
`;

const StyledContact = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
  height: 100%;
`;

const StyledWebsite = styled.div`
  margin-top: 1rem;
`;
