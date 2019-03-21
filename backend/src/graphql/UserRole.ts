import { enumType } from 'yoga';

export const UserRole = enumType({
  name: 'UserRole',
  members: [
    {
      name: 'CUSTOMER',
      value: 0
    },
    {
      name: 'EMPLOYEE',
      value: 1
    }
  ]
});
