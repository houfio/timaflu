import styled from '@emotion/styled/macro';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { ReactNode, useEffect, useState } from 'react';

import { Breakpoint, Identifiable } from '../types';
import { truncate } from '../utils/truncate';

import { Button } from './Button';
import { Input } from './Input';
import { Loading } from './Loading';
import { forBreakpoint } from '../utils/forBreakpoint';

type Props<T> = {
  onSearch: (search: string) => void,
  onSubmit: (value: T) => void,
  results?: T[],
  renderLine: (value: T) => string,
  render: (value: T) => ReactNode
};

type Values = {
  search: string
};

export function Search<T extends Identifiable>({ onSearch, onSubmit, results, renderLine, render }: Props<T>) {
  const [selected, setSelected] = useState<T>();
  const formik = useFormik<Values>({
    initialValues: {
      search: ''
    },
    validate: ({ search }) => onSearch(search),
    onSubmit: ({ search }) => onSearch(search)
  });

  useEffect(
    () => {
      if (results && !selected) {
        setSelected(results[0]);
      }
    },
    [results]
  );

  return (
    <FormikProvider value={formik}>
      <Form>
        <StyledSearch>
          <StyledBox>
            <StyledLeft>
              <Input name="search"/>
              <StyledResults>
                {results ? results.map((value) => (
                  <StyledResult
                    key={value.id}
                    onClick={() => setSelected(value)}
                    active={selected && value.id === selected.id}
                    type="button"
                  >
                    {truncate(renderLine(value), 20)}
                  </StyledResult>
                )) : (
                  <Loading/>
                )}
              </StyledResults>
            </StyledLeft>
            <div>
              {selected && render(selected)}
            </div>
          </StyledBox>
          <StyledButton type="button" disabled={!selected} onClick={() => selected && onSubmit(selected)}>
            Selecteren
          </StyledButton>
        </StyledSearch>
      </Form>
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
  margin-bottom: 1rem;
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
  :last-child {
    border-bottom-left-radius: .5rem;
    border-bottom-right-radius: .5rem;
  }
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, .1);
  }
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
