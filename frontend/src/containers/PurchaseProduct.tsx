import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
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
            icon: faFolderOpen,
            children: (
              <div/>
            )
          }
        ]}
      />
    </Content>
  );
}
