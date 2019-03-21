import styled from '@emotion/styled/macro';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { ReactNode, useEffect, useState } from 'react';

import { Identifiable } from '../types';
import { truncate } from '../utils/truncate';

import { Button } from './Button';
import { Input } from './Input';
import { Loading } from './Loading';

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
  margin-bottom: 1rem;
  padding: 1.5rem;
  background-color: whitesmoke;
  border-radius: .5rem;
`;

const StyledLeft = styled.div`
  margin-right: 1rem;
`;

const StyledResults = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  background-color: white;
  border-radius: .5rem;
  overflow: hidden;
  height: 15.625rem;
`;

const StyledResult = styled.span<{ active?: boolean }>`
  position: relative;
  padding: 1rem;
  transition: background-color .25s ease;
  background-color: ${(props) => props.active ? 'rgba(0, 0, 0, .1)' : 'white'};
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
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, .1);
  }
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
