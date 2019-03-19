import styled from '@emotion/styled/macro';
import React, { HTMLAttributes } from 'react';

export function Row(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <StyledRow {...props}/>
  );
}

const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
