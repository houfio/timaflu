import styled from '@emotion/styled/macro';
import { faMinus, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, useState } from 'react';

import { Breakpoint, Identifiable } from '../types';
import { compare } from '../utils/compare';
import { forBreakpoint } from '../utils/forBreakpoint';

type Props<T> = {
  rows: T[],
  columns: {
    [K in keyof T]?: Array<{
      heading: string,
      render?: (value: T[K], row: T) => ReactNode | undefined,
      sortable?: boolean,
      order?: number
    }>
  },
  onClick?: (row: T) => void
};

export function Table<T extends Identifiable>({ rows, columns, onClick }: Props<T>) {
  const [sort, setSort] = useState<{ key: keyof T, index: number, reverse: boolean }>();

  const columnKeys = Object.keys(columns) as Array<keyof T>;
  const updateSort = (key: keyof T, index: number) => {
    if (!sort || key !== sort.key || index !== sort.index) {
      setSort({
        key,
        index,
        reverse: false
      });

      return;
    }

    setSort(sort.reverse ? undefined : {
      key,
      index,
      reverse: true
    });
  };

  return (
    <StyledWrapper>
      <StyledTable>
        <StyledHead>
          <StyledRow clickable={false}>
            {columnKeys.map((key) => columns[key]!.map((column, index) => {
              const current = Boolean(sort && sort.key === key && sort.index === index);
              const reverse = Boolean(sort && sort.reverse);

              return (
                <StyledHeading
                  key={`${key}-${index}`}
                  onClick={() => column.sortable && updateSort(key, index)}
                  sortable={Boolean(column.sortable)}
                >
                  {column.sortable && (
                    <StyledSort icon={current ? reverse ? faSortDown : faSortUp : faSort} enabled={current}/>
                  )} {column.heading}
                </StyledHeading>
              );
            }))}
          </StyledRow>
        </StyledHead>
        <tbody>
          {[...rows || []]
            .sort((a, b) => {
              if (!sort || !columns[sort.key] || !columns[sort.key]![sort.index]) {
                return compare(a.id, b.id);
              }

              const column = columns[sort.key]![sort.index];
              const resultA = column.render ? column.render(a[sort.key], a) : a[sort.key];
              const resultB = column.render ? column.render(b[sort.key], b) : b[sort.key];

              if ((typeof resultA !== 'string' && typeof resultA !== 'number')
                || (typeof resultB !== 'string' && typeof resultB !== 'number')) {
                throw new Error('no u');
              }

              return compare(resultA, resultB) * (sort.reverse ? -1 : 1);
            })
            .map((row) => (
              <StyledRow
                key={row.id}
                clickable={Boolean(onClick)}
                onClick={() => onClick && onClick(row)}
                tabIndex={onClick ? 0 : undefined}
              >
                {columnKeys.map((key) => columns[key]!.map((column, index) => {
                  const children = column.render ? column.render(row[key], row) : row[key];

                  return (
                    <StyledData key={`${key}-${index}`} heading={column.heading}>
                      {children ? children : (
                        <FontAwesomeIcon icon={faMinus} fixedWidth={true} color="rgba(0, 0, 0, .1)"/>
                      )}
                    </StyledData>
                  );
                }))}
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
      background-color: rgba(0, 0, 0, .1);
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

const StyledHeading = styled.th<{ sortable: boolean }>`
  text-align: left;
  padding: .5rem;
  ${(props) => props.sortable && `
    :hover {
      cursor: pointer;
    }
  `};
`;

const StyledSort = styled(FontAwesomeIcon, { shouldForwardProp: (name) => name !== 'enabled' })<{ enabled: boolean }>`
  opacity: ${(props) => props.enabled ? 1 : .25};
  transition: opacity .25s ease;
`;
