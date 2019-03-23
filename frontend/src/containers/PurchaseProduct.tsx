import { faCheck, faIndustry, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import { Content } from '../components/Content';
import { Stepper } from '../components/Stepper';

export function PurchaseProduct() {
  return (
    <Content title="Product inkopen">
      <Stepper
        step={0}
        steps={[
          {
            icon: faShoppingCart,
            children: (
              <div/>
            )
          },
          {
            icon: faIndustry,
            children: (
              <div/>
            )
          },
          {
            icon: faCheck,
            children: (
              <div/>
            )
          }
        ]}
      />
    </Content>
  );
}
