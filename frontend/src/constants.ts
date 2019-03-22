import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
  faBox,
  faBoxOpen,
  faCheck,
  faMinus,
  faRobot,
  faTruck
} from '@fortawesome/free-solid-svg-icons';

import { Breakpoint, InvoiceState, ProductState } from './types';

export const BREAKPOINTS: Record<Breakpoint, number> = {
  [Breakpoint.Phone]: 0,
  [Breakpoint.TabletPortrait]: 600,
  [Breakpoint.TabletLandscape]: 900,
  [Breakpoint.Desktop]: 1200
};

export const INVOICE_STATES: Record<InvoiceState, { name: string, color: string, icon: IconProp }> = {
  PENDING: {
    name: '',
    color: 'rgba(0, 0, 0, .1)',
    icon: faMinus
  },
  COLLECTING: {
    name: 'Verzamelen',
    color: 'dodgerblue',
    icon: faRobot
  },
  COLLECTED: {
    name: 'Verzameld',
    color: 'green',
    icon: faBoxOpen
  },
  PACKAGED: {
    name: 'Verpakt',
    color: 'green',
    icon: faBox
  },
  SENT: {
    name: 'Verzonden',
    color: 'green',
    icon: faTruck
  },
  PAID: {
    name: 'Betaald',
    color: '#24292e',
    icon: faCheck
  }
};

export const PRODUCT_STATES: Record<ProductState, { color: string, icon: IconProp }> = {
  ZERO: {
    color: 'rgba(0, 0, 0, .1)',
    icon: faMinus
  },
  FAR_BELOW_MIN: {
    color: 'red',
    icon: faAngleDoubleDown
  },
  BELOW_MIN: {
    color: 'orange',
    icon: faAngleDown
  },
  ABOVE_MIN: {
    color: 'green',
    icon: faAngleUp
  },
  FAR_ABOVE_MIN: {
    color: 'green',
    icon: faAngleDoubleUp
  }
};
