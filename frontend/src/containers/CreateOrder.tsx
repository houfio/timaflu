import styled from '@emotion/styled/macro';
import { faCheck, faDatabase, faFolderOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import { gql } from 'apollo-boost';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Search } from '../components/Search';
import { Stepper } from '../components/Stepper';
import { useDebounce } from '../hooks/useDebounce';
import { Identifiable } from '../types';

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
  }
};

type Product = Identifiable & {
  name: string
};

export function CreateOrder() {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const { loading, data } = useQuery<{
    users: User[],
    products: Product[]
  }>(gql`
    query CreateOrder($search: String!) {
      users(search: $search, role: CUSTOMER, limit: 5) {
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
      }
      products {
        id
        name
      }
    }
  `, {
    variables: {
      search: debouncedSearch
    }
  });

  return (
    <Content title="Bestelling aanmaken">
      {!loading && data && data.users ? (
        <Stepper
          step={step}
          steps={[
            {
              icon: faUser,
              render: () => (
                <>
                  <StyledHeading type="h2">
                    Selecteer klant
                  </StyledHeading>
                  <Search<User>
                    onSearch={setSearch}
                    onSubmit={() => setStep(1)}
                    results={data && data.users}
                    renderLine={(value) => `${value.contact.first_name} ${value.contact.last_name}`}
                    render={(value) => (
                      <>
                        <Heading type="h2">
                          {value.contact.company}
                        </Heading>
                        <Heading type="h3">
                          {value.contact.first_name} {value.contact.last_name}
                        </Heading>
                        <StyledDetails>
                          <span>{value.contact.address}</span>
                          <span>{value.contact.postal_code} {value.contact.city}</span>
                          <span>{value.contact.country}</span>
                          <span>{value.contact.telephone}</span>
                        </StyledDetails>
                      </>
                    )}
                  />
                </>
              )
            },
            {
              icon: faFolderOpen,
              render: () => (
                <StyledHeading type="h2">
                  Selecteer producten
                </StyledHeading>
              )
            },
            {
              icon: faDatabase,
              render: () => (
                <span/>
              )
            },
            {
              icon: faCheck,
              render: () => (
                <span/>
              )
            }
          ]}
        />
      ) : (
        <Loading/>
      )}
    </Content>
  );
}

const StyledHeading = styled(Heading)`
  margin-bottom: 1rem;
`;

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;
