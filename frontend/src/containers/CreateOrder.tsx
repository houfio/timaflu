import styled from '@emotion/styled/macro';
import { faCheck, faFolderOpen, faMapMarkerAlt, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { forBreakpoint } from '../utils/forBreakpoint';
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
  min_order: number,
  manufacturer: {
    contact: {
      company: string
    }
  }
};

type ProductAmountPair = Identifiable & {
  product: Product,
  description: string,
  amount: number
};

type StepProps = {
  previousStep: () => void,
  nextStep: () => void,
  user?: User,
  setUser: (user: User) => void,
  products: ProductAmountPair[],
  setProducts: (products: ProductAmountPair[]) => void,
  contact?: Contact,
  setContact: (contact: Contact) => void,
  subtotal: number,
  total: number
};

export function CreateOrder() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<User>();
  const [products, setProducts] = useState<ProductAmountPair[]>([]);
  const [contact, setContact] = useState<Contact>();

  const subtotal = products.reduce((previous, current) => previous + current.product.price * current.amount, 0);
  const total = user ? subtotal * (1 - user.discount / 100) * (1 - (subtotal >= 500 ? .05 : 0)) : subtotal;

  const props: StepProps = {
    previousStep: () => setStep(step - 1),
    nextStep: () => setStep(step + 1),
    user,
    setUser,
    products,
    setProducts,
    contact,
    setContact,
    subtotal,
    total
  };

  return (
    <Content title="Bestelling aanmaken">
      <Stepper
        step={step}
        steps={[
          {
            icon: faUser,
            children: (
              <StepOne {...props}/>
            )
          },
          {
            icon: faFolderOpen,
            children: (
              <StepTwo {...props}/>
            )
          },
          {
            icon: faMapMarkerAlt,
            children: (
              <StepThree {...props}/>
            )
          },
          {
            icon: faCheck,
            children: (
              <StepFour {...props}/>
            )
          }
        ]}
      />
    </Content>
  );
}

function StepOne({ nextStep, user, setUser }: StepProps) {
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
              <span>{value.contact.address}</span>
              <span>{value.contact.postal_code} {value.contact.city}</span>
              <span>{value.contact.country}</span>
              <span>{value.contact.telephone}</span>
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

function StepTwo({ previousStep, nextStep, products, setProducts, subtotal, total }: StepProps) {
  type Values = {
    description: string,
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
        min_order
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
      description: '',
      amount: ''
    },
    onSubmit: ({ description, amount }, { resetForm }) => {
      if (!product) {
        return;
      }

      const current = products.find((p) => p.product.id === product.id);

      setProducts([
        ...products.filter((p) => p.product.id !== product.id),
        {
          id: product.id,
          product,
          description,
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
              <StyledInput
                name="amount"
                placeholder="Aantal"
                type="number"
                min={value.min_order}
                max={value.stock}
                required={true}
                margin={true}
              />
              <StyledInput name="description" placeholder="Extra notitie" margin={true}/>
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
          }],
          description: [{
            heading: 'Beschrijving',
            render: (value) => truncate(value, 20)
          }, {
            heading: '',
            render: (value, row) => (
              <Button onClick={() => setProducts(products.filter((p) => p.id !== row.product.id))}>
                <FontAwesomeIcon icon={faTimes}/>
              </Button>
            )
          }]
        }}
      />
      <StyledBottom>
        Totaalprijs: {priceFormat(total)} ({priceFormat(subtotal)} zonder kortingen)
      </StyledBottom>
    </>
  );
}

function StepThree({ previousStep, nextStep, user, contact, setContact }: StepProps) {
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
              Verzendadres
            </Heading>
            <Heading type="h3">
              {codeFormat(value.id)}
            </Heading>
            <StyledDetails>
              <span>{value.company}</span>
              <span>{value.first_name} {value.last_name}</span>
              <span>{value.address}</span>
              <span>{value.postal_code} {value.city}</span>
              <span>{value.country}</span>
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

function StepFour({ previousStep, user, products, contact, subtotal, total }: StepProps) {
  type Values = {
    description: string
  };

  const { history } = useRouter();

  if (!user || !products.length || !contact) {
    return null;
  }

  const formik = useFormik<Values>({
    initialValues: {
      description: ''
    },
    onSubmit: () => history.push('/orders')
  });

  return (
    <FormikProvider value={formik}>
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
            <span>{user.contact.address}</span>
            <span>{user.contact.postal_code} {user.contact.city}</span>
            <span>{user.contact.country}</span>
            <span>{user.contact.telephone}</span>
          </StyledContact>
        </Column>
        <Column breakpoints={{ [Breakpoint.Desktop]: 6 }}>
          <StyledContact>
            <Heading type="h2">
              Verzendadres
            </Heading>
            <span>{contact.company}</span>
            <span>{contact.first_name} {contact.last_name}</span>
            <span>{contact.address}</span>
            <span>{contact.postal_code} {contact.city}</span>
            <span>{contact.country}</span>
            <span>{contact.telephone}</span>
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
          }],
          description: [{
            heading: 'Beschrijving',
            render: (value) => truncate(value, 20)
          }]
        }}
        heading="Producten"
      />
      <Form>
        <StyledFooter column={true}>
          <StyledInput name="description" placeholder="Extra notitie" margin={false}/>
          <StyledTotal>Totaalprijs: {priceFormat(total)} ({priceFormat(subtotal)} zonder kortingen)</StyledTotal>
        </StyledFooter>
        <StyledFooter>
          <Button type="button" onClick={previousStep}>
            Vorige
          </Button>
          <Button type="submit">
            Afronden
          </Button>
        </StyledFooter>
      </Form>
    </FormikProvider>
  );
}

const StyledHeading = styled(Heading)`
  margin-bottom: 1rem;
`;

const StyledFooter = styled.div<{ right?: boolean, column?: boolean }>`
  display: flex;
  flex-direction: ${(props) => props.column ? 'column' : 'row'};
  justify-content: ${(props) => props.right ? 'flex-end' : 'space-between'};
  align-items: ${(props) => props.column ? 'flex-start' : 'center'};
  margin: 1rem 0;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    flex-direction: row;
    align-items: center;
  `)};
`;

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
`;

const StyledInput = styled(Input)<{ margin: boolean }>`
  display: block;
  max-width: 15rem;
  margin-bottom: ${(props) => props.margin ? 1 : 0}rem;
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

const StyledTotal = styled.span`
  display: inline-block;
  margin: .5rem 0 .5rem .75rem;
  ${forBreakpoint(Breakpoint.TabletLandscape, `
    margin: 0;
  `)};
`;
