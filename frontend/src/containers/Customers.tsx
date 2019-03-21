import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { INVOICE_STATES } from '../constants';
import { useRouter } from '../hooks/useRouter';
import { Identifiable, InvoiceState } from '../types';

type Customers = Identifiable & {
  id: number,
  contact: {
    first_name: string,
    last_name: string,
    company: string,
    telephone: string
  },
  orders: Array<{
    state: InvoiceState
  }>
};

export function Customers() {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    users: Customers[]
  }>(gql`
    query Users {
      users(role: CUSTOMER) {
        id
        contact {
          first_name
          last_name
          company
          telephone
        }
        orders {
          state
        }
      }
    }
  `);

  return (
    <Content title="Klanten">
      {!loading && data ? (
        <Table<Customers>
          rows={data.users}
          columns={{
            orders: [{
              heading: '',
              render: (value) => {
                if (!value.length) {
                  return;
                }

                const { icon, color } = INVOICE_STATES[value[0].state];

                return (
                  <FontAwesomeIcon icon={icon} color={color}/>
                );
              }
            }],
            contact: [{
              heading: 'Naam',
              render: (value) => value.company
            }, {
              heading: 'Contactpersoon',
              render: (value) => `${value.first_name} ${value.last_name}`
            }, {
              heading: 'Telefoonnummer',
              render: (value) => value.telephone
            }]
          }}
          onClick={({ id }) => history.push(`/customers/${id}`)}
        />
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
