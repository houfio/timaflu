import styled from '@emotion/styled/macro';
import React, { HTMLProps } from 'react';

type Props = {
  spacing?: number
};

export function Row({ spacing = 0, ...props }: Props & HTMLProps<HTMLDivElement>) {
  return (
    <StyledRow spacing={spacing} {...props}/>
  );
}

const StyledRow = styled.div<{ spacing: number }>`
  display: flex;
  flex-wrap: wrap;
  margin: -${(props) => props.spacing / 2}rem;
  > * {
    padding: ${(props) => props.spacing / 2}rem;
  }
`;
