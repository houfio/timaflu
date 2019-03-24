import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

import { Button } from '../components/Button';
import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';

type QueueLine = Identifiable & {
  bins: Array<Identifiable & {
    code: string
  }>,
  user: {
    contact: {
      company: string
    }
  }
};

const query = gql`
  query OrderQueue {
    queue {
      id
      bins {
        id
        code
      }
      user {
        contact {
          company
        }
      }
    }
  }
`;

export function OrderQueue() {
  return (
    <Query<{ queue: QueueLine[] }> query={query}>
      {({ loading, data }) => (
        <Content title="Wachtrij">
          {!loading && data ? (
            <Table<QueueLine>
              rows={data.queue}
              columns={{
                id: [{
                  heading: 'Factuur',
                  render: codeFormat,
                  sortable: true
                }],
                user: [{
                  heading: 'Klant',
                  render: (value) => value.contact.company
                }],
                bins: [{
                  heading: 'Bakken',
                  render: (value) => value.map((bin) => codeFormat(bin.code)).join(', ')
                }, {
                  heading: '',
                  render: () => (
                    <Button>
                      Print label
                    </Button>
                  )
                }, {
                  heading: '',
                  render: () => (
                    <Button>
                      Afronden
                    </Button>
                  )
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
