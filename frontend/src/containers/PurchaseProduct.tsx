import styled from '@emotion/styled/macro';
import { faCheck, faIndustry, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from 'apollo-boost';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { Query } from 'react-apollo';

import { Button } from '../components/Button';
import { Column } from '../components/Column';
import { Content } from '../components/Content';
import { Heading } from '../components/Heading';
import { Input } from '../components/Input';
import { Row } from '../components/Row';
import { Search } from '../components/Search';
import { Stepper } from '../components/Stepper';
import { PRODUCT_STATES } from '../constants';
import { useDebounce } from '../hooks/useDebounce';
import { useRouter } from '../hooks/useRouter';
import { Breakpoint, Identifiable, ProductState } from '../types';
import { codeFormat } from '../utils/codeFormat';
import { priceFormat } from '../utils/priceFormat';

type Product = Identifiable & {
  name: string,
  code: string,
  state: ProductState,
  stock: number,
  min_stock: number,
  location: string
};

type Manufacturer = Identifiable & {
  contact: {
    company: string,
    first_name: string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    telephone: string
  },
  product: Identifiable & {
    name: string,
    code: string,
    price: number,
    contents?: string,
    packaging?: string,
    packaging_amount?: string,
    packaging_size?: string
  }
};

type StepProps = {
  previousStep: () => void,
  nextStep: () => void,
  product?: Product,
  setProduct: (product: Product) => void,
  manufacturer?: Manufacturer,
  setManufacturer: (manufacturer: Manufacturer) => void
};

export function PurchaseProduct() {
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<Product>();
  const [manufacturer, setManufacturer] = useState<Manufacturer>();

  const props: StepProps = {
    previousStep: () => setStep(step - 1),
    nextStep: () => setStep(step + 1),
    product,
    setProduct,
    manufacturer,
    setManufacturer
  };

  return (
    <Content title="Product inkopen">
      <Stepper
        step={step}
        steps={[
          {
            icon: faShoppingCart,
            children: (
              <StepOne {...props}/>
            )
          },
          {
            icon: faIndustry,
            children: (
              <StepTwo {...props}/>
            )
          },
          {
            icon: faCheck,
            children: (
              <StepThree {...props}/>
            )
          }
        ]}
      />
    </Content>
  );
}

const queryOne = gql`
  query PurchaseProductProducts($search: String!) {
    products(search: $search, limit: 5, stock: false) {
      id
      name
      code
      state
      stock
      min_stock
      location
    }
  }
`;

function StepOne({ nextStep, product, setProduct }: StepProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  return (
    <Query<{ products: Product[] }>
      query={queryOne}
      variables={{
        search: debouncedSearch
      }}
    >
      {({ data, loading }) => (
        <>
          <StyledHeading type="h2">
            Selecteer product
          </StyledHeading>
          <Search<Product>
            onSearch={setSearch}
            value={product}
            onChange={setProduct}
            options={!loading && data ? data.products : undefined}
            renderLine={(value) => {
              const { icon, color } = PRODUCT_STATES[value.state];

              return (
                <>
                  <StyledStock icon={icon} color={color} fixedWidth={true}/>
                  {value.name}
                </>
              );
            }}
            render={(value) => (
              <>
                <Heading type="h2">
                  {value.name}
                </Heading>
                <Heading type="h3">
                  {codeFormat(value.code)}
                </Heading>
                <StyledDetails>
                  <span>Voorraad: {value.stock}/{value.min_stock}</span>
                  <span>Locatie: {value.location}</span>
                </StyledDetails>
              </>
            )}
          />
          <StyledFooter right={true}>
            <Button disabled={!product} onClick={nextStep}>
              Volgende
            </Button>
          </StyledFooter>
        </>
      )}
    </Query>
  );
}

const queryTwo = gql`
  query PurchaseProductManufacturers($search: String!, $product: String!) {
    manufacturers(search: $search, limit: 5, product: $product) {
      id
      contact {
        company
        first_name
        last_name
        address
        postal_code
        city
        country
        telephone
      }
      product(name: $product) {
        id
        name
        code
        price
        contents
        packaging
        packaging_amount
        packaging_size
      }
    }
  }
`;

function StepTwo({ previousStep, nextStep, product, manufacturer, setManufacturer }: StepProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  function fallback<T>(value: T | undefined | null, transform: (value: T) => string = (v) => String(v)) {
    return value !== undefined && value !== null ? transform(value) : 'Onbekend';
  }

  return (
    <Query<{ manufacturers: Manufacturer[] }>
      query={queryTwo}
      variables={{
        search: debouncedSearch,
        product: product && product.name
      }}
    >
      {({ data, loading }) => (
        <>
          <StyledHeading type="h2">
            Selecteer fabrikant
          </StyledHeading>
          <Search<Manufacturer>
            onSearch={setSearch}
            value={manufacturer}
            onChange={setManufacturer}
            options={!loading && data ? data.manufacturers : undefined}
            renderLine={(value) => value.contact.company}
            render={(value) => (
              <>
                <Heading type="h2">
                  {value.contact.company}
                </Heading>
                <Heading type="h3">
                  {codeFormat(value.id)}
                </Heading>
                <StyledDetails>
                  <span>Productcode: {codeFormat(value.product.id)}</span>
                  <span>Prijs: {fallback(value.product.price, priceFormat)}</span>
                  <span>Gewicht: {fallback(value.product.contents)}</span>
                  <span>Verpakking: {fallback(value.product.packaging)}</span>
                  <span>Hoeveelheid: {fallback(value.product.packaging_amount)}</span>
                  <span>Verpakkingsformaat: {fallback(value.product.packaging_size)}</span>
                </StyledDetails>
              </>
            )}
          />
          <StyledFooter>
            <Button onClick={previousStep}>
              Vorige
            </Button>
            <Button disabled={!manufacturer} onClick={nextStep}>
              Volgende
            </Button>
          </StyledFooter>
        </>
      )}
    </Query>
  );
}

function StepThree({ previousStep, manufacturer }: StepProps) {
  type Values = {
    amount: string
  };

  const { history } = useRouter();
  const formik = useFormik<Values>({
    initialValues: {
      amount: ''
    },
    onSubmit: () => history.push('/products')
  });

  if (!manufacturer) {
    return null;
  }

  function fallback<T>(value: T | undefined | null, transform: (value: T) => string = (v) => String(v)) {
    return value !== undefined && value !== null ? transform(value) : 'Onbekend';
  }

  const { amount } = formik.values;
  let total: number | undefined;

  if (Number(amount)) {
    total = Number(amount) * manufacturer.product.price;
  }

  return (
    <FormikProvider value={formik}>
      <StyledHeading type="h2">
        Bestelling controlleren
      </StyledHeading>
      <Form>
        <Row spacing={1}>
          <Column breakpoints={{ [Breakpoint.TabletLandscape]: 8 }}>
            <StyledBox>
              <Heading type="h2">
                {manufacturer.contact.company}
              </Heading>
              <Heading type="h3">
                {codeFormat(manufacturer.id)}
              </Heading>
              <span>{manufacturer.contact.first_name} {manufacturer.contact.last_name}</span>
              <span>{manufacturer.contact.address}</span>
              <span>{manufacturer.contact.postal_code} {manufacturer.contact.city}</span>
              <span>{manufacturer.contact.country}</span>
              <span>{manufacturer.contact.telephone}</span>
            </StyledBox>
            <StyledBox>
              <Heading type="h2">
                {manufacturer.product.name}
              </Heading>
              <Heading type="h3">
                {codeFormat(manufacturer.product.code)}
              </Heading>
              <span>Prijs: {fallback(manufacturer.product.price, priceFormat)}</span>
              <span>Gewicht: {fallback(manufacturer.product.contents)}</span>
              <span>Verpakking: {fallback(manufacturer.product.packaging)}</span>
              <span>Hoeveelheid: {fallback(manufacturer.product.packaging_amount)}</span>
              <span>Verpakkingsformaat: {fallback(manufacturer.product.packaging_size)}</span>
            </StyledBox>
          </Column>
          <Column breakpoints={{ [Breakpoint.TabletLandscape]: 4 }}>
            <StyledBox>
              <Input name="amount" type="number" min="1" placeholder="Aantal" required={true}/>
              <StyledTotal>Totaal: {fallback(total, priceFormat)}</StyledTotal>
            </StyledBox>
          </Column>
        </Row>
        <StyledFooter>
          <Button type="button" onClick={previousStep}>
            Vorige
          </Button>
          <Button type="submit" disabled={!manufacturer}>
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

const StyledStock = styled(FontAwesomeIcon)`
  margin-right: .5rem;
`;

const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

const StyledFooter = styled.div<{ right?: boolean }>`
  display: flex;
  justify-content: ${(props) => props.right ? 'flex-end' : 'space-between'};
  margin: 1rem 0;
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: .5rem;
  :not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const StyledTotal = styled.span`
  margin-top: 1rem;
`;
