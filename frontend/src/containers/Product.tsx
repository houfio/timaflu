import styled from '@emotion/styled/macro';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';

import { Button } from '../components/Button';
import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Row } from '../components/Row';
import { Table } from '../components/Table';
import { Breakpoint, Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';
import { Query } from 'react-apollo';

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
  sell_price?: number,
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

const query = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      code
      price
      sell_price
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
`;

export function Product({ match: { params: { id } } }: RouteComponentProps<Params>) {
  function fallback<T>(value: T | undefined | null, transform: (value: T) => string = (v) => String(v)) {
    return value !== undefined && value !== null ? transform(value) : 'Onbekend';
  }

  return (
    <Query<{ product: Product }>
      query={query}
      variables={{
        id
      }}
    >
      {({ loading, data }) => (
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
                  <StyledBox>
                    <Heading type="h2">
                      Informatie
                    </Heading>
                    <span>Inkoopprijsprijs: {fallback(data.product.price, priceFormat)}</span>
                    <span>Verkoopprijs: {fallback(data.product.sell_price, priceFormat)}</span>
                    <span>Huidige voorraad: {fallback(data.product.stock)}</span>
                    <span>Minimale voorraad: {fallback(data.product.min_stock)}</span>
                    <span>Gewicht: {fallback(data.product.contents)}</span>
                    <span>Verpakking: {fallback(data.product.packaging)}</span>
                    <span>Hoeveelheid: {fallback(data.product.packaging_amount)}</span>
                    <span>Verpakkingsformaat: {fallback(data.product.packaging_size)}</span>
                  </StyledBox>
                </Column>
                <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
                  <StyledBox>
                    <Heading type="h2">
                      Fabrikant
                    </Heading>
                    <span>{data.product.manufacturer.contact.company}</span>
                    <span>{data.product.manufacturer.contact.address}</span>
                    <span>
                      {data.product.manufacturer.contact.postal_code} {data.product.manufacturer.contact.city}
                    </span>
                    <span>{data.product.manufacturer.contact.country}</span>
                    <span>{data.product.manufacturer.contact.telephone}</span>
                    <StyledWebsite>
                      <Button onClick={() => window.location.assign(data.product.manufacturer.contact.website)}>
                        Website
                      </Button>
                    </StyledWebsite>
                  </StyledBox>
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
      )}
    </Query>
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

const StyledBox = styled.div`
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
