import { gql } from 'apollo-boost';
import React from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Product } from '../types';

export function Root() {
  const { loading, data } = useQuery<{
    products: Product[]
  }>(gql`
    query {
      products {
        id
        name
        code
      }
    }
  `);

  return (
    <>
      {loading ? 'Loading...' : data && data.products.map((product) => (
        <div key={product.id}>
          {product.name} ({product.code})
        </div>
      ))}
    </>
  );
}
