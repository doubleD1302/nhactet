export enum DistributionMode {
  EQUAL = 'EQUAL',
  RANDOM = 'RANDOM',
  DENOMINATION_RANDOM = 'DENOMINATION_RANDOM'
}

export interface EnvelopeData {
  id: number;
  amount: number;
  isOpened: boolean;
}

export interface GameSettings {
  totalAmount: number;
  totalEnvelopes: number;
  mode: DistributionMode;
  denominations?: number[];
}
