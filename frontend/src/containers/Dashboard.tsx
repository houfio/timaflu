import styled from '@emotion/styled/macro';
import { gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';
import { Bar } from 'react-chartjs-2';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Loading } from '../components/Loading';
import { Identifiable } from '../types';
import { priceFormat } from '../utils/priceFormat';

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
              <Heading type="h2">
                Best presterende producten
              </Heading>
              <StyledGraph>
                <Bar
                  data={{
                    labels: data.productRevenue.map((revenue) => revenue.product.name),
                    datasets: [{
                      label: 'Aantal',
                      type: 'line',
                      data: data.productRevenue.map((revenue) => revenue.amount),
                      yAxisID: 'y-axis-2',
                      borderColor: 'dodgerblue',
                      backgroundColor: 'dodgerblue'
                    }, {
                      label: 'Omzet',
                      type: 'bar',
                      data: data.productRevenue.map((revenue) => revenue.revenue),
                      yAxisID: 'y-axis-1',
                      backgroundColor: '#24292e',
                      borderColor: '#24292e'
                    }]
                  }}
                  options={{
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
                          id: 'y-axis-1',
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            callback: priceFormat
                          }
                        },
                        {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          id: 'y-axis-2',
                          gridLines: {
                            display: false
                          },
                          ticks: {
                            callback: (value) => `x${value}`
                          }
                        }
                      ]
                    }
                  }}
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
      )}
    </Query>
  );
}

const StyledGraph = styled.div`
  max-width: 37.5rem;
  margin-top: 2rem;
`;
