import { css, Global } from '@emotion/core';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';

import { Dashboard } from './Dashboard';

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
            box-shadow: 0 0 0 2px dodgerblue;
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
        </Switch>
      </BrowserRouter>
    </>
  );
}
