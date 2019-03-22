export enum Breakpoint {
  Phone,
  TabletPortrait,
  TabletLandscape,
  Desktop
}

export type Breakpoints<T> = Partial<Record<Breakpoint, T>>;

export type Identifiable = {
  id: string
};

export type HeadingType = 'h1' | 'h2' | 'h3';

export type InvoiceState = 'PENDING' | 'COLLECTING' | 'COLLECTED' | 'PACKAGED' | 'SENT' | 'PAID';

export type ProductState = 'ZERO' | 'FAR_BELOW_MIN' | 'BELOW_MIN' | 'ABOVE_MIN' | 'FAR_ABOVE_MIN';
