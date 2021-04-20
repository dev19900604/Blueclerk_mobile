import { IBaseModel } from '../../../interfaces/i-base-model';

export interface ICustomer extends IBaseModel {
  _id: string;
  info: {
    email: string;
  };
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    name: string;
    phone: string;
  };
  company: string
}
