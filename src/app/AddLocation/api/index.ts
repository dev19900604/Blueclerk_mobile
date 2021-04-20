import mime from 'mime';
import WebService from '../../../lib/web-service';
import { IServerResponse } from '../../../interfaces/i-server-response';
import { ICustomer } from '../types/i-customer';

export const BASE = 'https://blueclerk-node-api.deploy.blueclerk.com/api/v1';

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

export type CreateLocationPostParams = {
  nfcTag: string;
  images: string;
  jobLocation: string;
  jobSite?: string;
  address: string;
  customer: string;
  note?: string;
};

export function createLocationTag(data: CreateLocationPostParams) {
  const endpoint = `${BASE}/codeLocationTag`;
  return WebService.post<IServerResponse<'imageUrl', string>>(endpoint, { data });
}
