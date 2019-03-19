export enum Breakpoint {
  Phone,
  TabletPortrait,
  TabletLandscape,
  Desktop
}

export type Breakpoints<T> = Partial<Record<Breakpoint, T>>;

export type Product = {
  id: string,
  name: string,
  code: string
};
