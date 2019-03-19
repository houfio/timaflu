import { objectType } from 'yoga';

export const Contact = objectType({
  name: 'Contact',
  definition: (t) => {
    t.id('id');
    t.string('first_name');
    t.string('last_name');
    t.string('company', { nullable: true });
    t.string('address');
    t.string('postal_code');
    t.string('city');
    t.string('country');
    t.string('telephone');
    t.string('website', { nullable: true });
  }
});
