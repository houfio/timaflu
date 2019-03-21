import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Table } from '../components/Table';
import { useRouter } from '../hooks/useRouter';
import { Identifiable } from '../types';

import { Loading } from './Loading';

type Manufacturers = Identifiable & {
  id: number,
  contact: {
    first_name: string,
    last_name: string,
    company: string,
    telephone: string,
    website: string
  },
  products: {
    id: number,
    length: number // @LEX FIX DIT
  }
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
            products: [{
              heading: 'Aantal producten',
              render: (value) => value.length
            }],
            contact: [{
              heading: 'Naam',
              render: (value) => value.company
            }, {
              heading: 'Contactpersoon',
              render: (value) => `${value.first_name} ${value.last_name}`
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
