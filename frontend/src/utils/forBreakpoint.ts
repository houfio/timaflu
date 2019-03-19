import { css } from '@emotion/core';

import { BREAKPOINTS } from '../constants';
import { Breakpoint } from '../types';

export function forBreakpoint(breakpoint: Breakpoint, style: string) {
  if (breakpoint === Breakpoint.Phone) {
    return style;
  }

  return css`
    @media (min-width: ${BREAKPOINTS[breakpoint]}px) {
      ${style};
    }
  `;
}
