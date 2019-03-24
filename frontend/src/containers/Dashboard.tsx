import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import { Content } from '../components/Content';
import { Breakpoint, Identifiable, InvoiceState } from '../types';

type Product = Identifiable & {
  revenue: string,
  product: {
    name: string
  }
};

const productRevenueQuery = gql`
  query Product {
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
    <Content title="Dashboard">

      <h2>Top 5 meest verkochte producten</h2>

      <h2>Inkoop totaal per leverancier</h2>
      <h2>Welke orders heeft apotheek x openstaan op dit moment en wat is de status van de betreffende order?</h2>
      <h2>Geef de omzet van alle apothekers voor het afgelopen jaar en daarmee de korting voor volgend jaar.</h2>




      <div style={{ width: 400 }}>
        <h3>Top 5 meest winstgevende producten</h3>

        <Query<{ product: Product }>
          query={productRevenueQuery}
        >
          {({ loading, data }) => {
            if (loading) { return 'Laden..' }

            let labels = [];
            let datasets = [];

            data.forEach(e => {
              labels.push(e.product.name);
              datasets.push({ label: e.product.name, data: [e.revenue] })
            });

            return (
              <Bar
                data={{
                  labels: labels,
                  datasets: datasets
                }}
              />
            )
          }}
        </Query>
      </div>
    </Content>
  );
}
