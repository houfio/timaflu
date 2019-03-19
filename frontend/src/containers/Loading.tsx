import styled from '@emotion/styled/macro';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export function Loading() {
  return (
    <StyledLoading>
      <FontAwesomeIcon icon={faCog} spin={true} size="2x"/>
    </StyledLoading>
  );
}

const StyledLoading = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
