export enum Breakpoint {
  Phone,
  TabletPortrait,
  TabletLandscape,
  Desktop
}

export type Breakpoints<T> = Partial<Record<Breakpoint, T>>;

export type Identifiable = {
  id: number
};

export type HeadingType = 'h1' | 'h2' | 'h3';
