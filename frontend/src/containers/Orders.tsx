import styled from '@emotion/styled/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Table } from '../components/Table';
import { INVOICE_STATES } from '../constants';
import { Identifiable, InvoiceState } from '../types';

import { Loading } from './Loading';

type Order = Identifiable & {
  date: string,
  contact: {
    first_name: string,
    last_name: string
  },
  description?: string,
  total: number,
  state: InvoiceState
};

export function Orders() {
  const { loading, data } = useQuery<{
    orders: Order[]
  }>(gql`
    query Products {
      orders {
        id
        contact {
          first_name
          last_name
        }
        description
        total
        state
      }
    }
  `);

  return (
    <Content title="Bestellingen">
      {!loading && data ? (
        <Table<Order>
          rows={data.orders}
          columns={{
            state: {
              heading: 'Status',
              render: (value) => {
                const { name, color, icon } = INVOICE_STATES[value];

                return (
                  <>
                    <StyledState icon={icon} color={color} fixedWidth={true}/>
                    {name}
                  </>
                );
              }
            },
            contact: {
              heading: 'Klant',
              render: (value) => `${value.first_name} ${value.last_name}`
            },
            description: {
              heading: 'Beschrijving',
              render: (value) => value ? value.length > 20 ? `${value.substr(0, 20)}...` : value : undefined
            },
            total: {
              heading: 'Prijs',
              render: (value) => `€${value.toFixed(2)}`
            }
          }}
        />
      ) : (
        <Loading/>
      )}
    </Content>
  );
}

const StyledState = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
