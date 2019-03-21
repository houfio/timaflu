import { Connection, createConnection } from 'mysql';

export type Context = {
  db: Connection
};

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
  description?: string,
  description_short?: string,
  stock?: number,
  min_string?: number,
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
  name: string
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
  description?: string,
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

export default () => ({
  db: createConnection({
    host: 'databases.aii.avans.nl',
    database: 'bmgfrans_db',
    user: 'bmgfrans',
    password: 'Koolstof1'
  })
});
