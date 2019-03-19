import { css, Global } from '@emotion/core';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';

import { Customers } from './Customers';
import { Dashboard } from './Dashboard';
import { Invoices } from './Invoices';
import { Orders } from './Orders';
import { Product } from './Product';
import { Products } from './Products';

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
          <Route path="/" exact={true} component={Dashboard}/>
          <Route path="/orders" exact={true} component={Orders}/>
          <Route path="/invoices" exact={true} component={Invoices}/>
          <Route path="/customers" exact={true} component={Customers}/>
          <Route path="/products" exact={true} component={Products}/>
          <Route path="/products/:id" exact={true} component={Product}/>
        </Switch>
      </BrowserRouter>
    </>
  );
}
