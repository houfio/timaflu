import styled from '@emotion/styled/macro';
import { faCheck, faFolderOpen, faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { gql } from 'apollo-boost';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';

import { Button } from '../components/Button';
import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { Row } from '../components/Row';
import { Search } from '../components/Search';
import { Stepper } from '../components/Stepper';
import { Table } from '../components/Table';
import { useDebounce } from '../hooks/useDebounce';
import { useRouter } from '../hooks/useRouter';
import { Breakpoint, Identifiable } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';
import { truncate } from '../utils/truncate';

type Contact = Identifiable & {
  company: string,
  first_name: string,
  last_name: string,
  address: string,
  postal_code: string,
  city: string,
  country: string,
  telephone: string
};

type User = Identifiable & {
  discount: number,
  contact: Contact,
  billing: Contact[]
};

type Product = Identifiable & {
  name: string,
  code: string,
  price: number,
  stock: number,
  contents: string,
  packaging_amount: number,
  manufacturer: {
    contact: {
      company: string
    }
  }
};

type ProductAmountPair = Identifiable & {
  product: Product,
  amount: number
};

export function CreateOrder() {
  const { history } = useRouter();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User>();
  const [products, setProducts] = useState<ProductAmountPair[]>([]);
  const [contact, setContact] = useState<Contact>();

  const previousStep = () => setStep(step - 1);
  const nextStep = () => setStep(step + 1);

  const subtotal = products.reduce((previous, current) => previous + current.product.price * current.amount, 0);
  const total = user ? subtotal * (1 - user.discount / 100) * (1 - (subtotal >= 500 ? .05 : 0)) : subtotal;

  function ContactDetails({ contact: { address, postal_code, city, country, telephone } }: { contact: Contact }) {
    return (
      <>
        <span>{address}</span>
        <span>{postal_code} {city}</span>
        <span>{country}</span>
        <span>{telephone}</span>
      </>
    );
  }

  function StepOne() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 250);
    const { loading, data } = useQuery<{
      users: User[]
    }>(gql`
      query CreateOrderUsers($search: String!) {
        users(search: $search, limit: 5, role: CUSTOMER) {
          id
          discount
          contact {
            id
            company
            first_name
            last_name
            address
            postal_code
            city
            country
            telephone
          }
        }
      }
    `, {
      variables: {
        search: debouncedSearch
      }
    });

    return (
      <>
        <StyledHeading type="h2">
          Selecteer klant
        </StyledHeading>
        <Search<User>
          onSearch={setSearch}
          value={user}
          onChange={setUser}
          options={!loading ? data && data.users : undefined}
          renderLine={(value) => `${value.contact.first_name} ${value.contact.last_name}`}
          render={(value) => (
            <>
              <Heading type="h2">
                {value.contact.company}
              </Heading>
              <Heading type="h3">
                {value.contact.first_name} {value.contact.last_name}
              </Heading>
              <StyledDetails>
                <ContactDetails contact={value.contact}/>
              </StyledDetails>
            </>
          )}
        />
        <StyledFooter right={true}>
          <Button onClick={nextStep} disabled={!user}>
            Volgende
          </Button>
        </StyledFooter>
      </>
    );
  }

  function StepTwo() {
    type Values = {
      amount: string
    };

    const [product, setProduct] = useState<Product>();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 250);
    const { loading, data } = useQuery<{
      products: Product[]
    }>(gql`
      query CreateOrderProducts($search: String!) {
        products(search: $search, limit: 5, sold: true) {
          id
          name
          code
          price
          stock
          contents
          packaging_amount
          manufacturer {
            contact {
              company
            }
          }
        }
      }
    `, {
      variables: {
        search: debouncedSearch
      }
    });
    const formik = useFormik<Values>({
      initialValues: {
        amount: '1'
      },
      onSubmit: ({ amount }, { resetForm }) => {
        if (!product) {
          return;
        }

        const current = products.find((p) => p.product.id === product.id);

        setProducts([
          ...products.filter((p) => p.product.id !== product.id),
          {
            id: product.id,
            product,
            amount: Number(amount) + (current ? current.amount : 0)
          }
        ]);

        resetForm();
        setProduct(undefined);
      }
    });

    return (
      <>
        <StyledHeading type="h2">
          Selecteer producten
        </StyledHeading>
        <Search<Product>
          onSearch={setSearch}
          value={product}
          onChange={setProduct}
          options={!loading ? data && data.products : undefined}
          renderLine={(value) => value.name}
          render={(value) => (
            <FormikProvider value={formik}>
              <Heading type="h2">
                {value.name}
              </Heading>
              <Heading type="h3">
                {codeFormat(value.code)}
              </Heading>
              <StyledDetails>
                <span>Fabrikant: {value.manufacturer.contact.company}</span>
                <span>Inhoud: {value.packaging_amount}x {value.contents}</span>
                <span>Prijs: {priceFormat(value.price)}</span>
              </StyledDetails>
              <Form>
                <StyledInput name="amount" type="number" min="1" max={value.stock}/>
                <Button type="submit">
                  Toevoegen
                </Button>
              </Form>
            </FormikProvider>
          )}
        />
        <StyledFooter>
          <Button onClick={previousStep}>
            Vorige
          </Button>
          <Button onClick={nextStep} disabled={!products.length}>
            Volgende
          </Button>
        </StyledFooter>
        <Table<ProductAmountPair>
          rows={products}
          columns={{
            amount: [{
              heading: 'Aantal',
              sortable: true
            }],
            product: [{
              heading: 'Naam',
              render: (value) => value.name,
              sortable: true
            }, {
              heading: 'Code',
              render: (value) => codeFormat(value.code),
              sortable: true
            }, {
              heading: 'Prijs',
              render: (value, row) => priceFormat(value.price * row.amount),
              sortable: true
            }]
          }}
        />
        <StyledBottom>
          Totaalprijs: {priceFormat(total)} ({priceFormat(subtotal)} zonder kortingen)
        </StyledBottom>
      </>
    );
  }

  function StepThree() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 250);
    const { loading, data } = useQuery<{
      user: User
    }>(gql`
      query CreateOrderBilling($id: ID!, $search: String!) {
        user(id: $id) {
          billing(search: $search, limit: 5) {
            id
            company
            first_name
            last_name
            address
            postal_code
            city
            country
            telephone
          }
        }
      }
    `, {
      variables: {
        id: user ? user.id : '',
        search: debouncedSearch
      }
    });

    return (
      <>
        <StyledHeading type="h2">
          Selecteer verzendadres
        </StyledHeading>
        <Search<Contact>
          onSearch={setSearch}
          value={contact}
          onChange={setContact}
          options={!loading ? data && data.user.billing : undefined}
          renderLine={(value) => truncate(value.address, 20)}
          render={(value) => (
            <>
              <Heading type="h2">
                {value.company}
              </Heading>
              <Heading type="h3">
                {value.first_name} {value.last_name}
              </Heading>
              <StyledDetails>
                <ContactDetails contact={value}/>
              </StyledDetails>
            </>
          )}
        />
        <StyledFooter>
          <Button onClick={previousStep}>
            Vorige
          </Button>
          <Button onClick={nextStep} disabled={!contact}>
            Volgende
          </Button>
        </StyledFooter>
      </>
    );
  }

  function StepFour() {
    if (!user || !products.length || !contact) {
      return null;
    }

    return (
      <>
        <StyledHeading type="h2">
          Bestelling controleren
        </StyledHeading>
        <StyledRow spacing={1}>
          <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
            <StyledContact>
              <Heading type="h2">
                Factuuradres
              </Heading>
              <span>{user.contact.company}</span>
              <span>{user.contact.first_name} {user.contact.last_name}</span>
              <ContactDetails contact={user.contact}/>
            </StyledContact>
          </Column>
          <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
            <StyledContact>
              <Heading type="h2">
                Verzendadres
              </Heading>
              <span>{contact.company}</span>
              <span>{contact.first_name} {contact.last_name}</span>
              <ContactDetails contact={contact}/>
            </StyledContact>
          </Column>
        </StyledRow>
        <Table<ProductAmountPair>
          rows={products}
          columns={{
            amount: [{
              heading: 'Aantal',
              sortable: true
            }],
            product: [{
              heading: 'Naam',
              render: (value) => value.name,
              sortable: true
            }, {
              heading: 'Code',
              render: (value) => codeFormat(value.code),
              sortable: true
            }, {
              heading: 'Prijs',
              render: (value, row) => priceFormat(value.price * row.amount),
              sortable: true
            }]
          }}
        />
        <StyledBottom>
          Totaalprijs: {priceFormat(total)} ({priceFormat(subtotal)} zonder kortingen)
        </StyledBottom>
        <StyledFooter>
          <Button onClick={previousStep}>
            Vorige
          </Button>
          <Button onClick={() => history.push('/orders')}>
            Afronden
          </Button>
        </StyledFooter>
      </>
    );
  }

  return (
    <Content title="Bestelling aanmaken">
      <Stepper
        step={step}
        steps={[
          {
            icon: faUser,
            children: (
              <StepOne/>
            )
          },
          {
            icon: faFolderOpen,
            children: (
              <StepTwo/>
            )
          },
          {
            icon: faMapMarkerAlt,
            children: (
              <StepThree/>
            )
          },
          {
            icon: faCheck,
            children: (
              <StepFour/>
            )
          }
        ]}
      />
    </Content>
  );
}

const StyledHeading = styled(Heading)`
  margin-bottom: 1rem;
`;

const StyledFooter = styled.div<{ right?: boolean }>`
  display: flex;
  justify-content: ${(props) => props.right ? 'flex-end' : 'space-between'};
  margin: 1rem 0;
`;

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
`;

const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`;

const StyledBottom = styled.div`
  margin: 1rem 0;
  text-align: right;
`;

const StyledRow = styled(Row)`
  padding: 1rem 0;
`;

const StyledContact = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
`;
