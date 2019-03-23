import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Table } from '../components/Table';
import { Identifiable } from '../types';

type SelfOrder = Identifiable & {
  received: boolean
};

export function PurchaseHistory() {
  const { loading, data } = useQuery<{
    selfOrders: SelfOrder[]
  }>(gql`
    query Products {
      selfOrders {
        id
        received
      }
    }
  `);

  return (
    <Content title="Inkoophistorie">
      {!loading && data ? (
        <Table<SelfOrder>
          rows={data.selfOrders}
          columns={{
            received: [{
              heading: 'Ontvangen',
              render: (value) => (
                <FontAwesomeIcon icon={value ? faCheck : faTimes} color="#24292e" fixedWidth={true}/>
              )
            }]
          }}
        />
      ) : (
        <Loading/>
      )}
    </Content>
  );
}
