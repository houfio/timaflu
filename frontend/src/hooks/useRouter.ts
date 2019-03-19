import { useContext } from 'react';
import * as Router from 'react-router';
import { RouteComponentProps } from 'react-router';

export function useRouter() {
  return useContext((Router as any).__RouterContext) as RouteComponentProps;
}
