import styled from '@emotion/styled/macro';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';

import { useRouter } from '../hooks/useRouter';

type Props = {
  children: ReactNode,
  icon: IconProp,
  path: string,
  exact?: boolean
};

export function SidebarItem({ children, icon, path, exact }: Props) {
  const { history, location } = useRouter();

  const actualPath = `${process.env.PUBLIC_URL}${path}`;
  const current = location.pathname.endsWith('/')
    ? location.pathname.slice(0, location.pathname.length - 1)
    : location.pathname;

  return (
    <StyledItem
      active={exact ? current === actualPath : current.startsWith(actualPath)}
      onClick={() => history.push(actualPath)}
    >
      <StyledIcon icon={icon} fixedWidth={true}/>
      {children}
    </StyledItem>
  );
}

export const StyledItem = styled.button<{ active: boolean }>`
  display: flex;
  margin: .25rem;
  padding: .5rem .9rem;
  color: white;
  background-color: ${(props) => props.active ? '#383f46' : 'transparent'};
  border-radius: .5rem;
  overflow: hidden;
  transition: background-color .25s ease, transform .1s ease;
  :hover {
    cursor: pointer;
    background-color: #383f46;
  }
  :active {
    transform: scale(.95);
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: .9rem;
`;
