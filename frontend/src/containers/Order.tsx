import styled from '@emotion/styled/macro';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import React from 'react';
import { Query } from 'react-apollo';
import { Redirect, RouteComponentProps } from 'react-router';

import { Button } from '../components/Button';
import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Row } from '../components/Row';
import { Table } from '../components/Table';
import { INVOICE_STATES } from '../constants';
import { Breakpoint, Identifiable, InvoiceState } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';
import { truncate } from '../utils/truncate';

type Params = {
  id: string
};

type OrderLine = Identifiable & {
  total: number,
  amount: number,
  description?: string,
  product: {
    name: string,
    code: string
  }
};

type Invoice = Identifiable & {
  state: InvoiceState,
  send_date?: string,
  lines: Identifiable[]
};

type Contact = {
  company: string,
  first_name: string,
  last_name: string,
  address: string,
  postal_code: string,
  city: string,
  country: string,
  telephone: string
};

type Order = Identifiable & {
  description?: string,
  date: string,
  lines: OrderLine[],
  invoices: Invoice[],
  user: {
    contact: Contact
  },
  contact: Contact,
  days_left: number
};

const query = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      description
      date
      lines {
        id
        total
        amount
        description
        product {
          name
          code
        }
      }
      invoices {
        id
        state
        send_date
        lines {
          id
        }
      }
      user {
        contact {
          company
          first_name
          last_name
          address
          postal_code
          city
          country
        }
      }
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
      days_left
    }
  }
`;

export function Order({ match: { params: { id } } }: RouteComponentProps<Params>) {
  return (
    <Query<{ order: Order }>
      query={query}
      variables={{
        id
      }}
    >
      {({ loading, data }) => (
        <Content title="Bestelling">
          {!loading && data ? data.order ? (
            <>
              <Heading type="h1">
                {data.order.contact.company}
              </Heading>
              <Heading type="h3">
                Bestelling {codeFormat(data.order.id)}
              </Heading>
              <StyledDescription>
                {data.order.description || (
                  <FontAwesomeIcon icon={faMinus} color="rgba(0, 0, 0, .1)"/>
                )}
                <br/>
                Aangemaakt op {format(Number(data.order.date), 'PPPP', { locale: nl })}
              </StyledDescription>
              <StyledRow spacing={1}>
                <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
                  <StyledContact>
                    <Heading type="h2">
                      Factuuradres
                    </Heading>
                    <span>{data.order.contact.company}</span>
                    <span>{data.order.contact.first_name} {data.order.contact.last_name}</span>
                    <span>{data.order.contact.address}</span>
                    <span>{data.order.contact.postal_code} {data.order.contact.city}</span>
                    <span>{data.order.contact.country}</span>
                  </StyledContact>
                </Column>
                <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
                  <StyledContact>
                    <Heading type="h2">
                      Verzendadres
                    </Heading>
                    <span>{data.order.user.contact.company}</span>
                    <span>{data.order.user.contact.first_name} {data.order.contact.last_name}</span>
                    <span>{data.order.user.contact.address}</span>
                    <span>{data.order.user.contact.postal_code} {data.order.contact.city}</span>
                    <span>{data.order.user.contact.country}</span>
                  </StyledContact>
                </Column>
              </StyledRow>
              <Table<OrderLine>
                rows={data.order.lines}
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
                  description: [{
                    heading: 'Beschrijving',
                    render: (value) => value ? truncate(value, 20) : undefined
                  }],
                  amount: [{
                    heading: 'Aantal',
                    sortable: true
                  }],
                  total: [{
                    heading: 'Totaal',
                    render: priceFormat,
                    sortable: true
                  }]
                }}
                heading="Producten"
              />
              <StyledSpacer/>
              {data.order.days_left <= 0 && (
                <StyledWarning>
                  De betaalperiode van één of meer van de facturen is verstreken.
                  Telefoonnummer: {data.order.contact.telephone}
                </StyledWarning>
              )}
              <Table<Invoice>
                rows={data.order.invoices}
                columns={{
                  state: [{
                    heading: 'Status',
                    render: (value) => {
                      const { name, color, icon } = INVOICE_STATES[value];

                      return (
                        <>
                          <StyledState icon={icon} color={color} fixedWidth={true}/>
                          {name}
                        </>
                      );
                    }
                  }],
                  id: [{
                    heading: 'Code',
                    render: codeFormat
                  }],
                  send_date: [{
                    heading: 'Verstuurd op',
                    render: (value) => value ? format(Number(value), 'PPPP', { locale: nl }) : undefined,
                    sortable: true
                  }],
                  lines: [{
                    heading: 'Aantal producten',
                    render: (value) => value.length,
                    sortable: true
                  }, {
                    heading: '',
                    render: (value, row) => !row.send_date && row.state === 'SENT' ? (
                      <Button>
                        Factureer
                      </Button>
                    ) : ''
                  }]
                }}
                heading="Facturen"
              />
            </>
          ) : (
            <Redirect to="/orders"/>
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
  );
}

const StyledDescription = styled.span`
  display: block;
  margin: 1.5rem 0 1rem;
  max-width: 50rem;
`;

const StyledRow = styled(Row)`
  padding: 1rem 0;
`;

const StyledContact = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
`;

const StyledState = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;

const StyledSpacer = styled.div`
  height: 1rem;
`;

const StyledWarning = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  color: white;
  background-color: red;
  border-radius: .5rem;
`;
