import styled from '@emotion/styled/macro';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { ReactNode } from 'react';

import { Breakpoint, Identifiable } from '../types';
import { forBreakpoint } from '../utils/forBreakpoint';
import { truncate } from '../utils/truncate';

import { Input } from './Input';
import { Loading } from './Loading';

type Props<T> = {
  onSearch: (search: string) => void,
  value?: T,
  onChange: (value: T) => void,
  options?: T[],
  renderLine: (value: T) => string,
  render: (value: T) => ReactNode
};

type Values = {
  search: string
};

export function Search<T extends Identifiable>({ onSearch, value, onChange, options, renderLine, render }: Props<T>) {
  const formik = useFormik<Values>({
    initialValues: {
      search: ''
    },
    validate: ({ search }) => onSearch(search),
    onSubmit: ({ search }) => onSearch(search)
  });

  return (
    <FormikProvider value={formik}>
      <StyledSearch>
        <StyledBox>
          <StyledLeft>
            <Form>
              <Input name="search"/>
              <StyledResults>
                {options ? options.map((option) => (
                  <StyledResult
                    key={option.id}
                    onClick={() => onChange(option)}
                    active={value && option.id === value.id}
                    type="button"
                  >
                    {truncate(renderLine(option), 20)}
                  </StyledResult>
                )) : (
                  <Loading/>
                )}
              </StyledResults>
            </Form>
          </StyledLeft>
          <div>
            {value && render(value)}
          </div>
        </StyledBox>
      </StyledSearch>
    </FormikProvider>
  );
}

const StyledSearch = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: whitesmoke;
  border-radius: .5rem;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    flex-direction: row;
  `)};
`;

const StyledLeft = styled.div`
  margin: 0 0 1rem 0;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    margin: 0 1rem 0 0;
  `)};
`;

const StyledResults = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  background-color: white;
  border-radius: .5rem;
  height: 15.625rem;
`;

const StyledResult = styled.button<{ active?: boolean }>`
  position: relative;
  padding: 1rem;
  transition: background-color .25s ease;
  background-color: ${(props) => props.active ? 'rgba(0, 0, 0, .1)' : 'white'};
  text-align: start;
  :not(:first-child)::after {
    content: "";
    position: absolute;
    display: block;
    width: calc(100% - 2rem);
    height: 2px;
    top: -1px;
    left: 1rem;
    background-color: rgba(0, 0, 0, .1);
  }
  :first-child {
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }
  :nth-child(5) {
    border-bottom-left-radius: .5rem;
    border-bottom-right-radius: .5rem;
  }
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, .1);
  }
`;
