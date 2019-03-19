export enum Breakpoint {
  Phone,
  TabletPortrait,
  TabletLandscape,
  Desktop
}

export type Breakpoints<T> = Partial<Record<Breakpoint, T>>;

export type HeadingType = 'h1' | 'h2' | 'h3';
