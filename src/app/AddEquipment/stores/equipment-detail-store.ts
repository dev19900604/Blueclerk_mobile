import { task } from 'mobx-task';
import { computed, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import {
  createEquipment,
  fetchCustomers,
  fetchEquipmentBrands,
  fetchEquipmentTypes,
  createEquipmentType,
  createEquipmentBrand,
} from '../api';
import { IEquipmentBrand } from '../types/i-equipment-brand';
import { IEquipmentType } from '../types/i-equipment-type';
import { ICustomer } from '../types/i-customer';
import AddPhotosStore from './add-photos-store';
import { Service } from '../../../config/services';
import { IJobLocation } from '../../AddLocation/types/i-jobLocation';
import { IJobSite } from '../../AddLocation/types/i-jobSite';

export default class EquipmentDetailStore {
  @observable public name?: string;

  @observable public types: IEquipmentType[] = [];

  @observable public brands: IEquipmentBrand[] = [];

  @observable public customers: ICustomer[] = [];

  @observable public selectedType?: IEquipmentType;

  @observable public selectedBrand?: IEquipmentBrand;

  @observable public selectedCustomer?: ICustomer;

  @observable public model?: string;

  @observable public serialNumber?: string;

  @observable public selectedJobLocation?: IJobLocation;

  @observable public selectedJobSite?: IJobSite;

  @observable public selectedCustomerJobLocations: IJobLocation[] = [];

  @observable public selectedCustomerJobSites: IJobSite[] = [];

  @observable public note?: string;

  public photosStore?: AddPhotosStore;

  constructor(public nfcTag: string = '123123123') {}

  @task
  public async fetchEquipmentData() {
    const [
      {
        data: { brands },
      },
      {
        data: { types },
      },
    ] = await Promise.all([fetchEquipmentBrands(), fetchEquipmentTypes()]);
    this.brands = brands;
    this.types = types;
  }

  @task
  public async fetchCreateEquipmentType(txt: string) {
    await createEquipmentType(txt);
  }

  @task
  public async fetchCreateEquipmentBrand(txt: string) {
    await createEquipmentBrand(txt);
  }

  @task
  public async fetchCustomers() {
    const {
      data: { customers },
    } = await fetchCustomers();
    this.customers = customers;
  }

  @task
  public async fetchCustomerJobLocations() {
    const { data } = await Service.getJobLocations(
      {
        companyId: this.selectedCustomer?.company as string,
        customerId: this.selectedCustomer?._id as string,
      },
    );

    this.selectedCustomerJobLocations = data;
  }

  @task
  public async fetchCustomerJobSites() {
    const { data } = await Service.getJobSites(
      {
        locationId: this.selectedJobLocation?._id as string,
        customerId: this.selectedCustomer?._id as string,
      },
    );

    this.selectedCustomerJobSites = data;
  }

  @task.resolved
  public async createEquipment() {
    const serialNumber = await AsyncStorage.getItem('serialNumber');
    const brandId = await AsyncStorage.getItem('selectedBrand');
    const typeId = await AsyncStorage.getItem('selectedType');
    const model = await AsyncStorage.getItem('model');

    const equipmentData: any = {
      note: this.note!,
      model,
      serialNumber,
      nfcTag: this.nfcTag,
      images: this.photosStore!.imageUrls.join(','),
      equipmentTypeId: typeId,
      equipmentBrandId: brandId,
      customerId: this.selectedCustomer!._id,
      jobLocationId: this.selectedJobLocation!._id,
    };

    if (this.selectedJobSite) {
      equipmentData.jobSiteId = this.selectedJobSite._id;
    }

    const res = await createEquipment(equipmentData);

    return res.data;
  }

  @computed
  public get isEquipmentDataValid(): boolean {
    return [
      this.selectedType,
      this.selectedBrand,
      this.model,
      this.serialNumber,
    ].every(
      (i) => i !== undefined,
    );
  }

  @computed
  public get isCustomerDataValid(): boolean {
    return [this.selectedCustomer].every((i) => i !== undefined);
  }
}
