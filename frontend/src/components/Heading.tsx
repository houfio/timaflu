import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled/macro';
import React, { HTMLAttributes } from 'react';

import { HeadingType } from '../types';

type Props = {
  type: HeadingType
};

export function Heading({ type, ...props }: Props & HTMLAttributes<HTMLHeadingElement>) {
  const Styled = StyledHeading.withComponent(type);

  return (
    <Styled type={type} {...props}/>
  );
}

const types: Record<HeadingType, SerializedStyles> = {
  h1: css`
    color: rgba(0, 0, 0, .85);
    font-size: 2rem;
    font-weight: bold;
  `,
  h2: css`
    color: rgba(0, 0, 0, .65);
    font-size: 1.5rem;
    font-weight: normal;
  `,
  h3: css`
    margin-top: -.5rem;
    color: rgba(0, 0, 0, .45);
    font-size: .75rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  `
};

const StyledHeading = styled.span<{ type: HeadingType }>`
  margin: 0 0 .5rem 0;
  ${(props) => types[props.type]};
`;
