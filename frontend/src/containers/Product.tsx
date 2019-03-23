import styled from '@emotion/styled/macro';
import { faIndustry, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Row } from '../components/Row';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { Breakpoint, Identifiable } from '../types';
import { useRouter } from '../hooks/useRouter';
import { codeFormat } from '../utils/codeFormat';

type Params = {
  id: string
};

type Substances = Identifiable & {
  name: string
}

type Product = Identifiable & { 
  id: number,
  name: string,
  description: string,
  code: string,
  sold_since: string,
  price: number,
  min_stock: number,
  stock: number,
  contents: string,
  packaging: string,
  packaging_amount: string,
  packaging_size: string,
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
        description
        state
        code
        sold_since
        min_stock
        stock
        contents
        packaging
        packaging_amount
        packaging_size

        substances {
          name
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

  return (
    <Content title="Product">
      {!loading && data ? data.product ? (
        <>
          <Heading type="h1">
            {data.product.name}
          </Heading>
          <Heading type="h3">
            Product {codeFormat(data.product.id)} ({data.product.code})
          </Heading>
          <div>
            {data.product.description}
          </div>
          
          <br/>

          <StyledRow spacing={1}>
            <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
              <StyledContact>
                <Heading type="h2">
                  <FontAwesomeIcon icon={faInfoCircle} color="rgba(0, 0, 0, .65)"/> Informatie
                </Heading>
                {data.product.sold_since ?
                  <span>Verkocht sinds {new Date(parseInt(data.product.sold_since)).toLocaleDateString()}</span>
                  :
                  <span>Dit product word momenteel niet verkocht</span>
                }
                <span>Prijs {data.product.price ? `€ ${data.product.price}` : 'onbekend'}</span>
                <span>Minimale voorraad {data.product.min_stock ? data.product.min_stock : 0}</span>
                <span>Voorraad {data.product.stock ? data.product.stock : 0}</span>
                <span>Gewicht {data.product.contents ? data.product.contents : 'onbekend'}</span>
                <span>Verpakking {data.product.packaging ? data.product.packaging : 'onbekend'}</span>
                <span>Hoeveelheid in doos {data.product.packaging_amount ? data.product.packaging_amount : 'onbekend'}</span>
                <span>Verpakkings grootte {data.product.packaging_size ? data.product.packaging_size : 'onbekend'}</span>
              </StyledContact>
            </Column>

            <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
              <StyledContact>
                <Heading type="h2" onClick={() => history.push(`/manufacturers/${data.product.manufacturer.id}`)}>
                  <FontAwesomeIcon icon={faIndustry} color="rgba(0, 0, 0, .65)"/> Fabrikant
                </Heading>

                <span>{data.product.manufacturer.contact.company}</span>
                <span>{data.product.manufacturer.contact.address}, {data.product.manufacturer.contact.city}</span>
                <span>{data.product.manufacturer.contact.postal_code}</span>
                <span>{data.product.manufacturer.contact.country}</span>
                <span><a href={data.product.manufacturer.contact.website}>{data.product.manufacturer.contact.website}</a></span>
                <span><a href={`tel:${data.product.manufacturer.contact.telephone}`}>{data.product.manufacturer.contact.telephone}</a></span>
              </StyledContact>
            </Column>
          </StyledRow>


          <br/>

          <Heading type="h2">
            Middelen
          </Heading>

          <Table<Substances>
            rows={data.product.substances}
            columns={{
              name: [{
                heading: 'Naam'
              }]
            }}
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