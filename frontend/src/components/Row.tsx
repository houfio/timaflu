import styled from '@emotion/styled/macro';
import React, { HTMLProps } from 'react';

export function Row(props: HTMLProps<HTMLDivElement>) {
  return (
    <StyledRow {...props}/>
  );
}

const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
