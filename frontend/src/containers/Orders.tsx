import styled from '@emotion/styled/macro';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

import { Button } from '../components/Button';
import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { INVOICE_STATES } from '../constants';
import { useRouter } from '../hooks/useRouter';
import { Breakpoint, Identifiable, InvoiceState } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { forBreakpoint } from '../utils/forBreakpoint';
import { priceFormat } from '../utils/priceFormat';
import { truncate } from '../utils/truncate';

type Order = Identifiable & {
  date: string,
  contact: {
    company: string
  },
  description?: string,
  total: number,
  state: InvoiceState,
  days_left: number
};

const query = gql`
  query Products {
    orders {
      id
      contact {
        company
      }
      description
      total
      state
      days_left
    }
  }
`;

export function Orders() {
  const { history } = useRouter();

  return (
    <Query<{ orders: Order[] }> query={query}>
      {({ loading, data }) => (
        <Content title="Bestellingen">
          {!loading && data ? (
            <>
              <StyledHeader>
                <Button onClick={() => history.push(`${process.env.PUBLIC_URL}/orders/create`)}>
                  Bestelling aanmaken
                </Button>
                <Button onClick={() => history.push(`${process.env.PUBLIC_URL}/orders/queue`)}>
                  Wachtrij
                </Button>
              </StyledHeader>
              <Table<Order>
                rows={data.orders}
                columns={{
                  state: [{
                    heading: 'Status',
                    render: (value, row) => {
                      const { name, color, icon } = INVOICE_STATES[value];

                      return (
                        <>
                          <StyledState
                            icon={row.days_left <= 0 ? faCoins : icon}
                            color={row.days_left <= 0 ? 'red' : color}
                            fixedWidth={true}
                          />
                          {name}
                        </>
                      );
                    }
                  }],
                  id: [{
                    heading: 'Code',
                    render: codeFormat,
                    sortable: true
                  }],
                  contact: [{
                    heading: 'Klant',
                    render: (value) => value.company,
                    sortable: true
                  }],
                  description: [{
                    heading: 'Beschrijving',
                    render: (value) => value ? truncate(value, 20) : undefined
                  }],
                  total: [{
                    heading: 'Prijs',
                    render: priceFormat,
                    sortable: true
                  }]
                }}
                onClick={({ id }) => history.push(`${process.env.PUBLIC_URL}/orders/${id}`)}
              />
            </>
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
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

const StyledState = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
