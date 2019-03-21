import { enumType } from 'yoga';

export const InvoiceState = enumType({
  name: 'InvoiceState',
  members: [
    {
      name: 'PENDING',
      value: 0
    },
    {
      name: 'COLLECTING',
      value: 1
    },
    {
      name: 'COLLECTED',
      value: 2
    },
    {
      name: 'PACKAGED',
      value: 3
    },
    {
      name: 'SENT',
      value: 4
    },
    {
      name: 'PAID',
      value: 5
    }
  ]
});
