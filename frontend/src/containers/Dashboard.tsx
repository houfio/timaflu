import styled from '@emotion/styled/macro';
import { gql } from 'apollo-boost';
import { ChartOptions } from 'chart.js';
import React from 'react';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Identifiable } from '../types';
import { compare } from '../utils/compare';
import { priceFormat } from '../utils/priceFormat';

type Product = Identifiable & {
  product: {
    name: string
  },
  amount: number,
  revenue: number,
  profit: number
};

const query = gql`
  query Dashboard {
    productRevenue {
      product {
        name
      }
      amount
      revenue
      profit
    }
  }
`;

export function Dashboard() {
  return (
    <Query<{ productRevenue: Product[] }> query={query}>
      {({ loading, data }) => {
        const options = (callback: (value: any) => string | number): ChartOptions => ({
          responsive: true,
          tooltips: {
            mode: 'label'
          },
          elements: {
            line: {
              fill: false
            }
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                type: 'linear',
                display: true,
                position: 'left',
                gridLines: {
                  display: false
                },
                ticks: {
                  callback
                }
              }
            ]
          }
        });

        const revenues = loading || !data ? [] : [...data.productRevenue]
          .sort((a, b) => compare(b.revenue, a.revenue))
          .slice(0, 5);
        const amounts = loading || !data ? [] : [...data.productRevenue]
          .sort((a, b) => compare(b.amount, a.amount))
          .slice(0, 5);

        return (
          <Content title="Dashboard">
            {!loading && data ? (
              <>
                <Heading type="h2">
                  Producten met meeste omzet
                </Heading>
                <StyledGraph>
                  <Bar
                    data={{
                      labels: revenues.map((revenue) => revenue.product.name),
                      datasets: [{
                        label: 'Winst',
                        type: 'line',
                        data: revenues.map((revenue) => revenue.profit),
                        borderColor: 'dodgerblue',
                        backgroundColor: 'dodgerblue'
                      }, {
                        label: 'Omzet',
                        type: 'bar',
                        data: revenues.map((revenue) => revenue.revenue),
                        backgroundColor: '#24292e',
                        borderColor: '#24292e'
                      }]
                    }}
                    options={options(priceFormat)}
                    legend={{
                      position: 'bottom'
                    }}
                  />
                </StyledGraph>
                <Heading type="h2">
                  Meest verkochte producten
                </Heading>
                <StyledGraph>
                  <Bar
                    data={{
                      labels: amounts.map((revenue) => revenue.product.name),
                      datasets: [{
                        label: 'Aantal',
                        type: 'bar',
                        data: amounts.map((revenue) => revenue.amount),
                        backgroundColor: '#24292e',
                        borderColor: '#24292e'
                      }]
                    }}
                    options={options((value) => `${value}x`)}
                    legend={{
                      position: 'bottom'
                    }}
                  />
                </StyledGraph>
              </>
            ) : (
              <Loading/>
            )}
          </Content>
        );
      }}
    </Query>
  );
}

const StyledGraph = styled.div`
  max-width: 37.5rem;
  margin: 2rem 0;
`;
