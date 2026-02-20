import { atom } from 'recoil';
import { ChangeResponse } from '../types/index';

export const amountOwedState = atom<string>({
  key: 'amountOwed',
  default: '',
});

export const amountPaidState = atom<string>({
  key: 'amountPaid',
  default: '',
});

export const changeResultState = atom<ChangeResponse | null>({
  key: 'changeResult',
  default: null,
});

export const loadingState = atom<boolean>({
  key: 'loading',
  default: false,
});

export const errorState = atom<string | null>({
  key: 'error',
  default: null,
});

export const batchResultsState = atom<ChangeResponse[]>({
  key: 'batchResults',
  default: [],
});
