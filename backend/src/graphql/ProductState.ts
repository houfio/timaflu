import { enumType } from 'yoga';

export const ProductState = enumType({
  name: 'ProductState',
  members: [
    'ZERO',
    'FAR_BELOW_MIN',
    'BELOW_MIN',
    'ABOVE_MIN',
    'FAR_ABOVE_MIN'
  ]
});
