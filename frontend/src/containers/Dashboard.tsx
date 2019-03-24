import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';

import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Identifiable } from '../types';

type Product = Identifiable & {
  product: {
    name: string
  },
  amount: number,
  revenue: number
};

const query = gql`
  query Dashboard {
    productRevenue(limit: 5) {
      product {
        name
      }
      amount
      revenue
    }
  }
`;

export function Dashboard() {
  return (
    <Query<{ productRevenue: Product[] }> query={query}>
      {({ loading, data }) => (
        <Content title="Dashboard">
          {!loading && data ? (
            <>
              <Bar
                data={{
                  labels: data.productRevenue.map((revenue) => revenue.product.name),
                  datasets: data.productRevenue.map((revenue) => ({
                    label: revenue.product.name,
                    data: [revenue.revenue]
                  }))
                }}
              />
            </>
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
  );
}
