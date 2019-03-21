import styled from '@emotion/styled/macro';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
  faCheck, faMinus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Table } from '../components/Table';
import { useRouter } from '../hooks/useRouter';
import { Identifiable } from '../types';

import { Loading } from './Loading';

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
      }
    }
  `);

  return (
    <Content title="Producten">
      {!loading && data ? (
        <Table<Product>
          rows={data.products}
          columns={{
            stock: {
              heading: 'Voorraad',
              render: (value, { min_stock }) => min_stock ? (
                <>
                  <StyledStock
                    icon={value < min_stock / 2
                      ? faAngleDoubleDown
                      : value < min_stock
                        ? faAngleDown
                        : value > min_stock * 2
                          ? faAngleDoubleUp
                          : faAngleUp}
                    color={value < min_stock
                      ? 'red'
                      : value > min_stock
                        ? 'green'
                        : 'orange'}
                    fixedWidth={true}
                  />
                  {value}/{min_stock}
                </>
              ) : undefined
            },
            name: {
              heading: 'Naam'
            },
            code: {
              heading: 'Code'
            },
            manufacturer: {
              heading: 'Fabrikant',
              render: (value) => value.contact.company
            }
          }}
          onClick={({ id }) => history.push(`/products/${id}`)}
        />
      ) : (
        <Loading/>
      )}
    </Content>
  );
}

const StyledStock = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
