import { css } from '@emotion/core';

import { BREAKPOINTS } from '../constants';
import { Breakpoint } from '../types';

export function forBreakpoints<T, B extends Breakpoint>(
  breakpoints: { [V in B]?: T },
  getStyle: (value: T, breakpoint: B) => string
) {
  let result = '';

  for (const breakpoint in breakpoints) {
    if (breakpoints.hasOwnProperty(breakpoint)) {
      const value = breakpoints[breakpoint];
      const style = getStyle(value!, breakpoint);

      result += breakpoint === String(Breakpoint.Phone) ? style : `@media (min-width: ${BREAKPOINTS[breakpoint]}px) {
        ${style};
      `;
    }
  }

  return css(result);
}
