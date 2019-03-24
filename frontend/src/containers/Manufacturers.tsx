import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { useRouter } from '../hooks/useRouter';
import { Identifiable } from '../types';

type Manufacturers = Identifiable & {
  id: number,
  contact: {
    first_name: string,
    last_name: string,
    company: string,
    telephone: string,
    website: string
  },
  products: Identifiable[]
};

const query = gql`
  query Manufacturers {
    manufacturers {
      id
      contact {
        first_name
        last_name
        company
      }
      products {
        id
      }
    }
  }
`;

export function Manufacturers() {
  const { history } = useRouter();

  return (
    <Query<{ manufacturers: Manufacturers[] }> query={query}>
      {({ loading, data }) => (
        <Content title="Fabrikanten">
          {!loading && data ? (
            <Table<Manufacturers>
              rows={data.manufacturers}
              columns={{
                contact: [{
                  heading: 'Naam',
                  render: (value) => value.company,
                  sortable: true
                }, {
                  heading: 'Contactpersoon',
                  render: (value) => `${value.first_name} ${value.last_name}`,
                  sortable: true
                }],
                products: [{
                  heading: 'Aantal producten',
                  render: (value) => value.length,
                  sortable: true
                }]
              }}
              onClick={({ id }) => history.push(`${process.env.PUBLIC_URL}/manufacturers/${id}`)}
            />
          ) : (
            <Loading />
          )}
        </Content>
      )}
    </Query>
  );
}
