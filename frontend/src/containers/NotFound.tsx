import styled from '@emotion/styled/macro';
import React from 'react';

import { Content } from '../components/Content';
import { Heading } from '../components/Heading';

export function NotFound() {
  return (
    <Content>
      <StyledNotFound>
        <Heading type="h1">
          404
        </Heading>
        <Heading type="h3">
          Not found
        </Heading>
      </StyledNotFound>
    </Content>
  );
}

const StyledNotFound = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
