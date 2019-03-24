import { css, Global } from '@emotion/core';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';

import { CreateOrder } from './CreateOrder';
import { Customer } from './Customer';
import { Customers } from './Customers';
import { Dashboard } from './Dashboard';
import { Manufacturer } from './Manufacturer';
import { Manufacturers } from './Manufacturers';
import { NotFound } from './NotFound';
import { Order } from './Order';
import { OrderQueue } from './OrderQueue';
import { Orders } from './Orders';
import { Product } from './Product';
import { Products } from './Products';
import { PurchaseHistory } from './PurchaseHistory';
import { PurchaseProduct } from './PurchaseProduct';

export function Root() {
  return (
    <>
      <Global
        styles={css`
          html {
            font-family: "Open Sans", sans-serif;
            box-sizing: border-box;
          }
          *, *::before, *::after {
            box-sizing: inherit;
          }
          *:focus {
            outline: none;
            box-shadow: 0 0 0 2px inset dodgerblue;
          }
          body {
            overflow-y: scroll;
          }
          button {
            border: none;
            background: none;
          }
        `}
      />
      <BrowserRouter>
        <Sidebar/>
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/`} exact={true} component={Dashboard}/>
          <Route path={`${process.env.PUBLIC_URL}/orders`} exact={true} component={Orders}/>
          <Route path={`${process.env.PUBLIC_URL}/orders/create`} exact={true} component={CreateOrder}/>
          <Route path={`${process.env.PUBLIC_URL}/orders/queue`} exact={true} component={OrderQueue}/>
          <Route path={`${process.env.PUBLIC_URL}/orders/:id`} exact={true} component={Order}/>
          <Route path={`${process.env.PUBLIC_URL}/customers`} exact={true} component={Customers}/>
          <Route path={`${process.env.PUBLIC_URL}/customers/:id`} exact={true} component={Customer}/>
          <Route path={`${process.env.PUBLIC_URL}/products`} exact={true} component={Products}/>
          <Route path={`${process.env.PUBLIC_URL}/products/purchase`} exact={true} component={PurchaseProduct}/>
          <Route path={`${process.env.PUBLIC_URL}/products/purchase/history`} exact={true} component={PurchaseHistory}/>
          <Route path={`${process.env.PUBLIC_URL}/products/:id`} exact={true} component={Product}/>
          <Route path={`${process.env.PUBLIC_URL}/manufacturers`} exact={true} component={Manufacturers}/>
          <Route path={`${process.env.PUBLIC_URL}/manufacturers/:id`} exact={true} component={Manufacturer}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}
