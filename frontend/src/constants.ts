import { Breakpoint } from './types';

export const BREAKPOINTS: Record<Breakpoint, number> = {
  [Breakpoint.Phone]: 0,
  [Breakpoint.TabletPortrait]: 600,
  [Breakpoint.TabletLandscape]: 900,
  [Breakpoint.Desktop]: 1200
};
