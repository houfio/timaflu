import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

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

export function Manufacturers() {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    manufacturers: Manufacturers[]
  }>(gql`
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
  `);

  return (
    <Content title="Fabrikanten">
      {!loading && data ? (
        <Table<Manufacturers>
          rows={data.manufacturers}
          columns={{
            contact: [{
              heading: 'Naam',
              render: (value) => value.company
            }, {
              heading: 'Contactpersoon',
              render: (value) => `${value.first_name} ${value.last_name}`
            }],
            products: [{
              heading: 'Aantal producten',
              render: (value) => value.length
            }]
          }}
          onClick={({ id }) => history.push(`/manufacturers/${id}`)}
        />
      ) : (
        <Loading />
      )}
    </Content>
  );
}
