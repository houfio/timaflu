import { objectType } from 'yoga';

export const Substance = objectType({
  name: 'Substance',
  definition: (t) => {
    t.id('id');
    t.string('name');
  }
});
