import { objectType } from 'yoga';

export const Robot = objectType({
  name: 'Robot',
  definition: (t) => {
    t.id('id');
    t.string('code');
  }
});
