import { IBaseModel } from './i-base-model';

export interface IUser extends IBaseModel {
  auth: {
    email: string;
    password: string;
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
    phone: string;
  };
  permissions: {
    role: number;
  };
  info: {
    companyName: string;
    logoUrl: string;
    industry: string;
  };
  company: string;
}
