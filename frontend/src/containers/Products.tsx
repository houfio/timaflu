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
import { Breakpoint, Identifiable, ProductState } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { forBreakpoint } from '../utils/forBreakpoint';

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
            <Button onClick={() => history.push('/products/purchase')}>
              Product inkopen
            </Button>
            <Button onClick={() => history.push('/products/purchase/history')}>
              Inkoophistorie
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
                sortable: true
              }],
              name: [{
                heading: 'Naam',
                sortable: true
              }],
              manufacturer: [{
                heading: 'Fabrikant',
                render: (value) => value.contact.company,
                sortable: true
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
  flex-direction: column;
  margin-bottom: 1rem;
  ${forBreakpoint(Breakpoint.TabletPortrait, `
    flex-direction: row;
  `)};
  > * + * {
    margin: 1rem 0 0 0;
    ${forBreakpoint(Breakpoint.TabletPortrait, `
      margin: 0 0 0 1rem;
    `)};
  }
`;

const StyledStock = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
