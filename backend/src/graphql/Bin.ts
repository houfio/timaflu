import { objectType } from 'yoga';

export const Bin = objectType({
  name: 'Bin',
  definition: (t) => {
    t.id('id');
    t.string('code');
  }
});
