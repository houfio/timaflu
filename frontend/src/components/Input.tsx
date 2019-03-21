import styled from '@emotion/styled/macro';
import { useField } from 'formik';
import React, { HTMLProps } from 'react';

type Props = {
  name: string
};

export function Input({ name, ...props }: Props & HTMLProps<HTMLInputElement>) {
  const [field] = useField(name);

  return (
    <StyledInput {...props} {...field}/>
  );
}

const StyledInput = styled.input`
  padding: .5rem .75rem;
  border: none;
  border-radius: .5rem;
`;
