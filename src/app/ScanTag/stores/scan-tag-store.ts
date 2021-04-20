import { task } from 'mobx-task';
import { observable } from 'mobx';
import { fetchCustomerEquipments } from '../api';
import { Equipment } from '../types/equipment';

export default class ScanTagStore {
  @observable public equipments: Equipment[] = [];

  @task
  public async getCustomerEquipments() {
    const { data } = await fetchCustomerEquipments();
    this.equipments = data.equipments;
    this.equipments.map((e) => {
      console.log('equipment tag:', e.info.nfcTag);
    });
  }

  public equipmentExists(tagStr: string): boolean {
    return this.equipments.some((e) => e.info.nfcTag === tagStr);
  }
}
