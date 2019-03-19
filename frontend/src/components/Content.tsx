import styled from '@emotion/styled/macro';
import React, { ReactNode } from 'react';

import { Breakpoint } from '../types';
import { forBreakpoint } from '../utils/forBreakpoint';

import { Heading } from './Heading';

type Props = {
  children?: ReactNode,
  title: string
};

export function Content({ children, title }: Props) {
  return (
    <StyledContent>
      <StyledHeader>
        <Heading type="h1">
          {title}
        </Heading>
      </StyledHeader>
      <StyledInner>
        {children}
      </StyledInner>
    </StyledContent>
  );
}

const StyledContent = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 4rem;
  transition: margin-left .5s ease;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    margin-left: 15rem;
  `)};
`;

const StyledHeader = styled.div`
  padding: 2.5rem 1rem 2rem;
  background-color: whitesmoke;
`;

const StyledInner = styled.div`
  flex: 1;
  margin: 1rem;
`;
