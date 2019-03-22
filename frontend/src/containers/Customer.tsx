import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Redirect, RouteComponentProps } from 'react-router';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';

type Params = {
  id: string
};

type User = Identifiable & {
  contact: {
    company: string
  }
};

export function Customer({ match: { params: { id } } }: RouteComponentProps<Params>) {
  const { loading, data } = useQuery<{
    user: User
  }>(gql`
    query Customer($id: ID!) {
      user(id: $id) {
        id
        contact {
          company
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
        </>
      ) : (
        <Redirect to="/customers"/>
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
