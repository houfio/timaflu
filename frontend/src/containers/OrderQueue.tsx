import styled from '@emotion/styled/macro';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

import { Button } from '../components/Button';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';

type OrderLine = Identifiable & {
  amount: number,
  product: {
    name: string,
    code: string
  }
};

type QueueLine = Identifiable & {
  bins: Array<Identifiable & {
    code: string
  }>,
  invoice: {
    lines: OrderLine[],
    order: {
      contact: {
        company: string,
        first_name: string,
        last_name: string,
        address: string,
        postal_code: string,
        city: string,
        country: string,
        telephone: string
      }
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
      invoice {
        lines {
          id
          amount
          product {
            name
            code
          }
        }
        order {
          contact {
            company
            first_name
            last_name
            address
            postal_code
            city
            country
            telephone
          }
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
                invoice: [{
                  heading: 'Klant',
                  render: (value) => value.order.contact.company
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
              renderExtra={(row) => (
                <StyledExtra>
                  <Heading type="h2">
                    Verzendadres
                  </Heading>
                  <span>{row.invoice.order.contact.company}</span>
                  <span>{row.invoice.order.contact.first_name} {row.invoice.order.contact.last_name}</span>
                  <span>{row.invoice.order.contact.address}</span>
                  <span>{row.invoice.order.contact.postal_code} {row.invoice.order.contact.city}</span>
                  <span>{row.invoice.order.contact.country}</span>
                  <StyledTable>
                    <Table<OrderLine>
                      rows={row.invoice.lines}
                      columns={{
                        product: [{
                          heading: 'Product',
                          render: (value) => value.name,
                          sortable: true
                        }, {
                          heading: 'Code',
                          render: (value) => codeFormat(value.code),
                          sortable: true
                        }],
                        amount: [{
                          heading: 'Aantal',
                          sortable: true
                        }]
                      }}
                    />
                  </StyledTable>
                </StyledExtra>
              )}
            />
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
  );
}

const StyledExtra = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTable = styled.div`
  margin-top: 1rem;
`;
