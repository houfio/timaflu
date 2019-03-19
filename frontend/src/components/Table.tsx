import styled from '@emotion/styled/macro';
import React, { ReactNode } from 'react';

import { Breakpoint, Identifiable } from '../types';
import { forBreakpoint } from '../utils/forBreakpoint';

type Props<T> = {
  rows: T[],
  columns: {
    [K in keyof T]?: {
      heading: string,
      render?: (value: T[K]) => ReactNode
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
            <StyledRow key={row.id} clickable={Boolean(onClick)} onClick={() => onClick && onClick(row)}>
              {columnKeys.map((key) => {
                const column = columns[key]!;

                return (
                  <StyledData key={key as string} heading={column.heading}>
                    {column.render ? column.render(row[key]) : row[key]}
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
  table-layout: fixed;
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
  display: block;
  padding: .5rem;
  transition: background-color .25s ease;
  :not(:last-child) {
    border-bottom: 2px solid #dadada;
  }
  ${(props) => props.clickable && `
    :hover {
      cursor: pointer;
      background-color: white;
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