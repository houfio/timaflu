import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBox, faBoxOpen, faCheck, faMinus, faRobot, faTruck } from '@fortawesome/free-solid-svg-icons';

import { Breakpoint, InvoiceState } from './types';

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
