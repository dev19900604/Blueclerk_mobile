import { observable } from 'mobx';
import { task } from 'mobx-task';
import { IBaseModel } from '../../../interfaces/i-base-model';
import { fetchIndustries } from '../api/user-auth';

export interface IIndustry extends IBaseModel {
  title: string;
}

export default class CompanyInfoStore {
  @observable industries: IIndustry[] = [];

  @observable selectedIndustry?: IIndustry;

  @task
  public async getIndustries() {
    const { data } = await fetchIndustries();
    this.industries = data.industries;
  }
}
