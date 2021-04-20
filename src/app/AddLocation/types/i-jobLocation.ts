import { IBaseModel } from '../../../interfaces/i-base-model';
import { IJobSite } from './i-jobSite';

export interface IJobLocation extends IBaseModel {
    name: string
    contact: {
        name: string
        phone: string
        email: string
    },
    address: {
        city: string
        state: string
        street: string
        zipcode: string
    },
    location: {
        long: number
        lat: number
    },
    jobSites: IJobSite[]
    customerId: string
    companyId: string
}
