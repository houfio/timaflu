import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Table } from '../components/Table';
import { useRouter } from '../hooks/useRouter';
import { Identifiable } from '../types';

import { Loading } from './Loading';

type Customers = Identifiable & {
  id: number,
  contact: {
    first_name: string,
    last_name: string,
    company: string,
    telephone: string,
    website: string
  }
};

export function Customers() {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    users: Customers[]
  }>(gql`
    query Users {
      users {
        id
        contact {
          first_name
          last_name
          company
          telephone
          website
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
            contact: {
                heading: 'Naam',
                render: (value) => `${value.company} - ${value.first_name} ${value.last_name}`
            }
          }}
          onClick={({ id }) => history.push(`/customers/${id}`)}
        />
      ) : (
          <Loading />
        )}
    </Content>
  );
}
