import mime from 'mime';
import WebService from '../../../lib/web-service';
import { IServerResponse } from '../../../interfaces/i-server-response';
import { IEquipmentType } from '../types/i-equipment-type';
import { IEquipmentBrand } from '../types/i-equipment-brand';
import { ICustomer } from '../types/i-customer';

export const BASE = 'https://blueclerk-node-api.deploy.blueclerk.com/api/v1';
export function fetchEquipmentTypes() {
  const endpoint = `${BASE}/getEquipmentTypes`;
  return WebService.post<IServerResponse<'types', IEquipmentType[]>>(endpoint);
}

export function fetchEquipmentBrands() {
  const endpoint = `${BASE}/getEquipmentBrands`;
  return WebService.post<IServerResponse<'brands', IEquipmentBrand[]>>(endpoint);
}

export function fetchCustomers() {
  const endpoint = `${BASE}/getCustomers`;
  return WebService.post<IServerResponse<'customers', ICustomer[]>>(endpoint, {
    data: {
      includeActive: true,
      includeNonActive: false,
    },
  });
}

export function uploadImage(url: string) {
  const endpoint = `${BASE}/uploadImage`;
  const type = mime.getType(url);
  const name = url.split('/').pop();

  const formData = new FormData();
  formData.append('image', {
    uri: url,
    type,
    name,
  });

  return WebService.post<IServerResponse<'imageUrl', string>>(endpoint, {
    data: formData,
  });
}

export type CreateEquipmentPostParams = {
  model: string;
  serialNumber: string;
  nfcTag: string;
  images: string;
  equipmentTypeId: string;
  equipmentBrandId: string | any;
  jobLocation: string;
  jobSite?: string;
  customerId: string;
  location: string;
};

export function createEquipment(data: any) {
  const endpoint = `${BASE}/createCustomerEquipment`;
  return WebService.post<IServerResponse<'imageUrl', string>>(endpoint, { data });
}

export function createEquipmentType(title: String) {
  const endpoint = `${BASE}/createEquipmentType`;
  return WebService.post(endpoint, { data: { title } });
}

export function createEquipmentBrand(title: String) {
  const endpoint = `${BASE}/createEquipmentBrand`;
  return WebService.post(endpoint, { data: { title } });
}
