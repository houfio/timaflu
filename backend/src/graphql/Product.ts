import { objectType } from 'yoga';

export const Product = objectType({
  name: 'Product',
  definition: (t) => {
    t.id('id');
    t.string('name');
    t.string('code');
  }
});
