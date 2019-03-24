export type User = {
  id: number,
  role: number,
  contact_id: number
};

export type Contact = {
  id: number,
  first_name: string,
  last_name: string,
  company?: string,
  address: string,
  postal_code: string,
  city: string,
  country: string,
  telephone: string,
  website?: string
};

export type Product = {
  id: number,
  manufacturer_id: number,
  name: string,
  code: string,
  price: number,
  sell_price?: number,
  description?: string,
  description_short?: string,
  stock?: number,
  min_stock?: number,
  contents?: string,
  location?: string,
  packaging?: number,
  packaging_amount?: number,
  packaging_size?: number,
  min_order?: number,
  sold_since?: string
};

export type Substance = {
  id: number,
  product_id: number,
  substance_id: number,
  quantity: string
};

export type Manufacturer = {
  id: number,
  contact_id: number
};

export type Order = {
  id: number,
  billing_id: number,
  description?: string,
  date: string,
  discount: number
};

export type OrderLine = {
  id: number,
  product_id: number,
  order_id: number,
  amount: number,
  description?: string,
  total: number
};

export type InvoiceLine = {
  id: number,
  bin_id: number,
  product_id: number,
  invoice_id: number,
  robot_id: number,
  amount: number
};

export type Invoice = {
  id: number,
  order_id: number,
  state: number,
  tax: number,
  date: string
};

export type Robot = {
  id: number,
  code: string
};

export type Bin = {
  id: number,
  code: string
};

export type SelfOrder = {
  id: number,
  date: string,
  received: boolean
};

export type SelfOrderLine = {
  id: number,
  product_id: number,
  self_order_id: number,
  amount: number,
  total: number
};

export type QueueLine = {
  id: number
};

export type ProductRevenue = {
  id: number,
  amount: number,
  revenue: number,
  profit: number
};
