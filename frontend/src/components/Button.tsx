import styled from '@emotion/styled/macro';
import React, { HTMLProps } from 'react';

export function Button(props: HTMLProps<HTMLButtonElement>) {
  return (
    <StyledButton {...props}/>
  );
}

const StyledButton = styled.button<{ disabled?: boolean }>`
  padding: .5rem .75rem;
  color: white;
  background-color: #24292e;
  border-radius: .5rem;
  font-size: .9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: ${(props) => props.disabled ? '.5' : '.9'};
  pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
  transition: opacity .25s ease, transform .1s ease;
  :hover {
    cursor: pointer;
    opacity: 1;
  }
  :active {
    transform: scale(.95);
  }
`;
