import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import React from 'react';
import { Query } from 'react-apollo';

import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';

type SelfOrder = Identifiable & {
  date: string,
  received: boolean,
  lines: Array<{
    amount: number,
    total: number
  }>
};

const query = gql`
  query Products {
    selfOrders {
      id
      date
      received
      lines {
        amount
        total
      }
    }
  }
`;

export function PurchaseHistory() {
  return (
    <Query<{ selfOrders: SelfOrder[] }> query={query}>
      {({ loading, data }) => (
        <Content title="Inkoophistorie">
          {!loading && data ? (
            <Table<SelfOrder>
              rows={data.selfOrders}
              columns={{
                received: [{
                  heading: 'Ontvangen',
                  render: (value) => (
                    <FontAwesomeIcon icon={value ? faCheck : faTimes} color="#24292e" fixedWidth={true}/>
                  )
                }],
                id: [{
                  heading: 'Code',
                  render: (value) => codeFormat(value)
                }],
                date: [{
                  heading: 'Datum',
                  render: (value) => format(Number(value), 'PPPP', { locale: nl })
                }],
                lines: [{
                  heading: 'Aantal producten',
                  render: (value) => value.reduce((previous, current) => previous + current.amount, 0)
                }, {
                  heading: 'Prijs',
                  render: (value) => priceFormat(value.reduce((previous, current) => previous + current.total, 0))
                }]
              }}
            />
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
  );
}
