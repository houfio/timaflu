import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';

import { Content } from '../components/Content';
import { Loading } from '../components/Loading';
import { Identifiable } from '../types';

type Product = Identifiable & {
  revenue: number,
  product: {
    name: string
  }
};

const query = gql`
  query Dashboard {
    productRevenue(top: 5) {
      revenue
      product {
        name
      }
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
              <h2>Top 5 meest verkochte producten</h2>
              <h2>Inkoop totaal per leverancier</h2>
              <h2>
                Welke orders heeft apotheek x openstaan op dit moment en wat is de status van de betreffende order?
              </h2>
              <h2>
                Geef de omzet van alle apothekers voor het afgelopen jaar en daarmee de korting voor volgend jaar.
              </h2>
              <div style={{ width: 400 }}>
                <h3>Top 5 meest winstgevende producten</h3>
                <Bar
                  data={{
                    labels: data.productRevenue.map((revenue) => revenue.product.name),
                    datasets: data.productRevenue.map((revenue) => ({
                      label: revenue.product.name,
                      data: [revenue.revenue]
                    }))
                  }}
                />
              </div>
            </>
          ) : (
            <Loading/>
          )}
        </Content>
      )}
    </Query>
  );
}
