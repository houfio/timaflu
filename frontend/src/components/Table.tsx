import styled from '@emotion/styled/macro';
import React, { ReactNode } from 'react';

import { Breakpoint, Identifiable } from '../types';
import { forBreakpoint } from '../utils/forBreakpoint';

type Props<T> = {
  rows: T[],
  columns: {
    [K in keyof T]?: {
      heading: string,
      render?: (value: T[K], row: T) => ReactNode
    }
  },
  onClick?: (row: T) => void
};

export function Table<T extends Identifiable>({ rows, columns, onClick }: Props<T>) {
  const columnKeys = Object.keys(columns) as Array<keyof typeof columns>;

  return (
    <StyledWrapper>
      <StyledTable>
        <StyledHead>
          <StyledRow clickable={false}>
            {columnKeys.map((key) => {
              const column = columns[key]!;

              return (
                <StyledHeading key={key as string}>
                  {column.heading}
                </StyledHeading>
              );
            })}
          </StyledRow>
        </StyledHead>
        <tbody>
          {rows.map((row) => (
            <StyledRow key={row.id} clickable={Boolean(onClick)} onClick={() => onClick && onClick(row)} tabIndex={0}>
              {columnKeys.map((key) => {
                const column = columns[key]!;

                return (
                  <StyledData key={key as string} heading={column.heading}>
                    {column.render ? column.render(row[key], row) : row[key]}
                  </StyledData>
                );
              })}
            </StyledRow>
          ))}
        </tbody>
      </StyledTable>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  overflow: hidden;
`;

const StyledHead = styled.thead`
  display: none;
  ${forBreakpoint(Breakpoint.Desktop, `
    display: table-header-group;
  `)};
`;

const StyledRow = styled.tr<{ clickable: boolean }>`
  position: relative;
  display: block;
  padding: .5rem;
  border-radius: .5rem;
  transition: background-color .25s ease, transform .1s ease;
  :not(:last-child) {
    margin-bottom: 2px;
    ::after {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 2px;
      left: 0;
      bottom: -2px;
      background-color: #dadada;
      ${forBreakpoint(Breakpoint.Desktop, `
        display: none;
      `)};
    }
    ${forBreakpoint(Breakpoint.Desktop, `
      margin-bottom: 0;
    `)};
  }
  ${(props) => props.clickable && `
    :hover {
      cursor: pointer;
      background-color: white;
    }
    :active {
      transform: scale(.99);
    }
  `};
  ${forBreakpoint(Breakpoint.Desktop, `
    display: table-row;
    padding: 0;
    border-bottom: none !important;
  `)};
`;

const StyledData = styled.td<{ heading: string }>`
  display: block;
  padding: .5rem;
  text-align: right;
  :first-child {
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
  }
  :last-child {
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
  }
  ::before {
    content: "${(props) => props.heading}";
    float: left;
    margin-right: 1rem;
    ${forBreakpoint(Breakpoint.Desktop, `
      display: none;
    `)};
  }
  ${forBreakpoint(Breakpoint.Desktop, `
    display: table-cell;
    text-align: left;
  `)};
`;

const StyledHeading = styled.th`
  text-align: left;
  padding: .5rem;
`;
