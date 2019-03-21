import styled from '@emotion/styled/macro';
import {
  faIndustry,
  faPills,
  faShoppingCart,
  faTachometerAlt,
  faTruck,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Breakpoint } from '../types';
import { forBreakpoint } from '../utils/forBreakpoint';

import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <StyledSidebar>
      <StyledBrand>
        <StyledLogo icon={faPills} size="2x"/>
        Timaflu
      </StyledBrand>
      <SidebarItem icon={faTachometerAlt} path="/" exact={true}>
        Dashboard
      </SidebarItem>
      <SidebarItem icon={faTruck} path="/orders">
        Bestellingen
      </SidebarItem>
      <SidebarItem icon={faUser} path="/customers">
        Klanten
      </SidebarItem>
      <SidebarItem icon={faShoppingCart} path="/products">
        Producten
      </SidebarItem>
      <SidebarItem icon={faIndustry} path="/manufacturers">
        Fabrikanten
      </SidebarItem>
    </StyledSidebar>
  );
}

const StyledSidebar = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 4rem;
  height: 100vh;
  padding: .25rem;
  background-color: #24292e;
  transition: width .5s ease;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    width: 15rem;
  `)};
`;

const StyledBrand = styled.div`
  display: flex;
  align-items: center;
  width: 2.25rem;
  margin: 2.25rem auto 2.5rem;
  color: white;
  overflow: hidden;
  transition: width .5s ease;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    width: 6.5rem;
  `)};
`;

const StyledLogo = styled(FontAwesomeIcon)`
  margin-right: .75rem;
`;
