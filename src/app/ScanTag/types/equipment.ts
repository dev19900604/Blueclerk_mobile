import { IBaseModel } from '../../../interfaces/i-base-model';

export type Equipment = IBaseModel & {
  info: {
    model: string;
    serialNumber: string;
    nfcTag: string;
    imageUrl: string;
  };
  maintenance: {
    interval: string;
    nextDate: string;
  };
  type: string;
  brand: string;
  customer: string;
  jobs: string[];
};
