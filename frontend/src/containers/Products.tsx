import styled from '@emotion/styled/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Button } from '../components/Button';
import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { PRODUCT_STATES } from '../constants';
import { useRouter } from '../hooks/useRouter';
import { Identifiable, ProductState } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { compare } from '../utils/compare';

type Product = Identifiable & {
  name: string,
  code: string,
  stock: number,
  min_stock: number,
  manufacturer: {
    contact: {
      company: string
    }
  }
  state: ProductState
};

export function Products() {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    products: Product[]
  }>(gql`
    query Products {
      products {
        id
        name
        code
        stock
        min_stock
        manufacturer {
          contact {
            company
          }
        }
        state
      }
    }
  `);

  return (
    <Content title="Producten">
      {!loading && data ? (
        <>
          <StyledHeader>
            <Button>
              Product inkopen
            </Button>
          </StyledHeader>
          <Table<Product>
            rows={data.products}
            columns={{
              state: [{
                heading: 'Voorraad',
                render: (value, { stock, min_stock }) => {
                  const { icon, color } = PRODUCT_STATES[value];

                  return min_stock ? (
                    <>
                      <StyledStock icon={icon} color={color} fixedWidth={true}/>
                      {stock}/{min_stock}
                    </>
                  ) : undefined;
                }
              }],
              code: [{
                heading: 'Code',
                render: codeFormat,
                sort: (a, b) => compare(a.code, b.code)
              }],
              name: [{
                heading: 'Naam',
                sort: (a, b) => compare(a.name, b.name)
              }],
              manufacturer: [{
                heading: 'Fabrikant',
                render: (value) => value.contact.company,
                sort: (a, b) => compare(a.manufacturer.contact.company, b.manufacturer.contact.company)
              }]
            }}
            onClick={({ id }) => history.push(`/products/${id}`)}
          />
        </>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}

const StyledHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const StyledStock = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
