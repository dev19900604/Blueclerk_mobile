import { URL } from '../../../config/apis';
import WebService from '../../../lib/web-service';
import { IServerResponse } from '../../../interfaces/i-server-response';
import { Equipment } from '../types/equipment';
import store from '../../../redux/store';

type scanTagResponse = {
  status: number;
  tagStatus: number;
  message: string;
};

export async function fetchCustomerEquipments() {
  const endpoint = `${URL}/getCustomerEquipments`;
  const res = await WebService.post<IServerResponse<'equipments', Equipment[]>>(
    endpoint,
    {
      data: { customerId: store.getState().UserReducer!.profile._id },
    }
  );

  return res;
}

export const fetchScanTag = async (nfcTag: string) => {
  const endpoint = `${URL}/ScanTag`;
  const { data } = await WebService.post<IServerResponse<'tagStatus', number>>(endpoint, {
    data: { nfcTag },
  });
  return { tagStatus: data.tagStatus, tagType: data.tagType };
};
