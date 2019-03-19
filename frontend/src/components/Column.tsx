import styled from '@emotion/styled/macro';
import React, { HTMLAttributes } from 'react';

import { Breakpoints } from '../types';
import { forBreakpoints } from '../utils/forBreakpoints';

type Props = {
  breakpoints: Breakpoints<number>
};

export function Column(props: Props & HTMLAttributes<HTMLDivElement>) {
  return (
    <StyledColumn {...props}/>
  );
}

const StyledColumn = styled.div<{ breakpoints: Breakpoints<number> }>`
  display: flex;
  flex: 0 0 100%;
  ${(props) => forBreakpoints(props.breakpoints, (value) => `
    flex-basis: ${100 / 12 * value}%;
  `)};
`;
