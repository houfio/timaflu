import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

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

const query = gql`
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
`;

export function Customers() {
  const { history } = useRouter();

  return (
    <Query<{ users: Customers[] }> query={query}>
      {({ loading, data }) => (
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
                      <FontAwesomeIcon icon={icon} color={color} fixedWidth={true}/>
                    );
                  }
                }],
                contact: [{
                  heading: 'Naam',
                  render: (value) => value.company,
                  sortable: true
                }, {
                  heading: 'Contactpersoon',
                  render: (value) => `${value.first_name} ${value.last_name}`,
                  sortable: true
                }, {
                  heading: 'Telefoonnummer',
                  render: (value) => value.telephone
                }]
              }}
              onClick={({ id }) => history.push(`${process.env.PUBLIC_URL}/customers/${id}`)}
            />
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
  );
}
