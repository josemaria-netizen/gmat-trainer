import { QUANT } from './bank-quant.js';
import { VERBAL } from './bank-verbal.js';
import { DI } from './bank-di.js';

export const BANK = [...QUANT, ...VERBAL, ...DI];

export const SECTIONS = {
  quant: 'Quant',
  verbal: 'Verbal',
  di: 'Data Insights',
};
