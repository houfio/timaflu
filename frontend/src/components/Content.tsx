import styled from '@emotion/styled/macro';
import React, { Component, ErrorInfo, ReactNode } from 'react';

import { Breakpoint } from '../types';
import { forBreakpoint } from '../utils/forBreakpoint';

import { Heading } from './Heading';

type Props = {
  children?: ReactNode,
  title?: string
};

type State = {
  error?: Error
};

export class Content extends Component<Props> {
  public state: State = {};

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error
    });
  }

  public render() {
    const { children, title } = this.props;
    const { error } = this.state;

    return (
      <StyledContent>
        {title && (
          <StyledHeader>
            <Heading type="h1">
              {title}
            </Heading>
          </StyledHeader>
        )}
        {error ? (
          <StyledError>
            <Heading type="h1">
              Oh nee
            </Heading>
            <Heading type="h3">
              Er is iets mis gegaan
            </Heading>
          </StyledError>
        ) : (
          <StyledInner>
            {children}
          </StyledInner>
        )}
      </StyledContent>
    );
  }
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
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 1rem;
`;

const StyledError = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
