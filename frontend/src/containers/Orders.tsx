import styled from '@emotion/styled/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Button } from '../components/Button';
import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { INVOICE_STATES } from '../constants';
import { useRouter } from '../hooks/useRouter';
import { Identifiable, InvoiceState } from '../types';
import { truncate } from '../utils/truncate';

type Order = Identifiable & {
  date: string,
  contact: {
    company: string
  },
  description?: string,
  total: number,
  state: InvoiceState
};

export function Orders() {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    orders: Order[]
  }>(gql`
    query Products {
      orders {
        id
        contact {
          company
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
        <>
          <StyledHeader>
            <Button onClick={() => history.push('/orders/create')}>
              Bestelling aanmaken
            </Button>
          </StyledHeader>
          <Table<Order>
            rows={data.orders}
            columns={{
              state: [{
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
              }],
              contact: [{
                heading: 'Klant',
                render: (value) => value.company
              }],
              description: [{
                heading: 'Beschrijving',
                render: (value) => value ? truncate(value, 20) : undefined
              }],
              total: [{
                heading: 'Prijs',
                render: (value) => `€${value.toFixed(2)}`
              }]
            }}
            onClick={({ id }) => history.push(`/order/${id}`)}
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

const StyledState = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
