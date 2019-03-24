import styled from '@emotion/styled/macro';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { INVOICE_STATES } from '../constants';
import { useRouter } from '../hooks/useRouter';
import { Identifiable, InvoiceState } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';
import { truncate } from '../utils/truncate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Params = {
  id: string
};

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

type User = Identifiable & {
  contact: {
    company: string,
    first_name: string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    telephone: string
  },
  orders: Order[]
};

export function Customer({ match: { params: { id } } }: RouteComponentProps<Params>) {
  const { history } = useRouter();
  const { loading, data } = useQuery<{
    user: User
  }>(gql`
    query Customer($id: ID!) {
      user(id: $id) {
        id
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
    }
  `, {
    variables: {
      id
    }
  });

  return (
    <Content title="Klant">
      {!loading && data ? data.user ? (
        <>
          <Heading type="h1">
            {data.user.contact.company}
          </Heading>
          <Heading type="h3">
            Klant {codeFormat(data.user.id)}
          </Heading>
          <StyledDescription>
            Contactpersoon: {data.user.contact.first_name} {data.user.contact.last_name}
          </StyledDescription>
          <StyledBox>
            <Heading type="h2">
              Informatie
            </Heading>
            <span>{data.user.contact.company}</span>
            <span>{data.user.contact.address}</span>
            <span>{data.user.contact.postal_code} {data.user.contact.city}</span>
            <span>{data.user.contact.country}</span>
            <span>{data.user.contact.telephone}</span>
          </StyledBox>
          <Table<Order>
            rows={data.user.orders}
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
            heading="Bestellingen"
            onClick={({ id: i }) => history.push(`/orders/${i}`)}
          />
        </>
      ) : (
        <Redirect to="/customers"/>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}

const StyledDescription = styled.span`
  display: block;
  margin: 1.5rem 0 1rem;
  max-width: 50rem;
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
  height: 100%;
`;

const StyledState = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;
