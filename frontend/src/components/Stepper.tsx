import styled from '@emotion/styled/macro';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode } from 'react';

type Props = {
  step: number,
  steps: Array<{
    icon: IconProp,
    render: () => ReactNode
  }>
};

export function Stepper({ step: current, steps }: Props) {
  return (
    <StyledStepper>
      <StyledSteps>
        {steps.map((step, index) => (
          <StyledProgress key={index} active={current >= index}>
            <FontAwesomeIcon icon={step.icon} fixedWidth={true} color="white"/>
          </StyledProgress>
        ))}
      </StyledSteps>
      <StyledStep>
        {steps[current].render()}
      </StyledStep>
    </StyledStepper>
  );
}

const StyledStepper = styled.div`
  display: flex;
`;

const StyledSteps = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const StyledProgress = styled.div<{ active: boolean }>`
  position: relative;
  padding: .5rem;
  background-color: #24292e;
  border-radius: .5rem;
  opacity: ${(props) => props.active ? 1 : .5};
  transition: opacity .25s ease;
  :not(:first-child) {
    margin-top: 2rem;
    ::before {
      content: "";
      display: block;
      position: absolute;
      width: 2px;
      height: 1rem;
      top: -1.5rem;
      left: 1rem;
      background-color: #24292e;
    }
  }
`;

const StyledStep = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
