import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Apis, URL } from './apis';
import store from '../redux/store';

const createParams = (params) => Object.entries(params)
  .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
  .join('&');

export const getHeader = () => ({
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    Authorization: store.getState().UserReducer.token,
  },
});

export const getJsonHeader = () => ({
  headers: {
    'Content-type': 'application/json',
    Authorization: store.getState().UserReducer.token,
  },
});

export const Service = {
  Login: async (
    param,
    setLoading,
    setmessage,
    dispatcher,
    navigation,
    setvisible,
    onPresshNeverAskAlert,
  ) => {
    setLoading(true);
    Axios.post(Apis.Login, param)
      .then((data) => {
        setLoading(false);
        if (data && data.data.token) {
          if (data.data.user && data.data.user.hasOwnProperty('agreed')) {
            if (data.data.user.agreed) {
              dispatcher(data.data.user, data.data.token);
              navigation.navigate('App', { foo: 'bar' });
            } else {
              AsyncStorage.setItem('auth-token', data.data.token);
              onPresshNeverAskAlert();
            }
          } else {
            dispatcher(data.data.user, data.data.token);
            navigation.navigate('App', { foo: 'bar' });
          }
        } else {
          setmessage('Invalid email address or password');
          setvisible(true);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  },
  SignUp: async (param, setLoading, setshowSuccess, dispatcher, setshowSnackbar) => {
    setLoading(true);
    const { socialId } = param;

    Axios.post(socialId ? Apis.SocialSignup : Apis.Signup, param)
      .then((data) => {
        setLoading(false);
        if (data && data.data.token) {
          dispatcher(data.data.user, data.data.token);
          setshowSuccess(true);
        } else {
          setshowSnackbar({ show: true, message: data.data.message, back: true });
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  },
  getIndustries: async (setIndustries, setShow) => {
    Axios.post(Apis.getIndustries)
      .then((res) => {
        if (res.data.status == 1) {
          setIndustries(res.data.industries);
        } else {
          setShow();
        }
      })
      .catch((error) => {
        console.log(' error String ', JSON.stringify(error));
      });
  },
  forgotPassword: async (data: any) => {
    const response = await Axios.post(Apis.forgotPassword, data);

    return response;
  },
  agreedTerms: async (data) => {
    const head = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: await AsyncStorage.getItem('auth-token'),
      },
    };

    const body = createParams(data);
    const response = await Axios.post(Apis.agreeTerms, body, head);
    return response;
  },
  getJobs: async (screen) => {
    const head = getHeader();
    let res: any;
    const { profile } = store.getState().UserReducer;

    if (profile.permissions.role == 1) {
      if (screen != '') {
        res = await Axios.post(
          Apis.getTechnicianJobs,
          createParams({ employeeId: profile._id }),
          head,
        );
        return res;
      }

      res = await Axios.post(
        Apis.getTechnicianJobsToday,
        createParams({ employeeId: profile._id }),
        head,
      );
      return res;
    }

    res = await Axios.post(
      Apis.getJobs,
      createParams({ includeActive: 'true', includeNonActive: 'true' }),
      head,
    );
    return res;
  },
  getTechJobs: async () => {
    const head = getHeader();
    const { profile } = store.getState().UserReducer;
    const body = createParams({ employeeId: profile._id });
    const response = await Axios.post(Apis.getTechJobs, body, head);
    return response;
  },
  getJobTypes: () => new Promise((resolve, reject) => {
    const body = createParams({});
    Axios.post(`${URL}/getJobTypes`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data.types);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  startJob: async (data) => {
    const head = getHeader();
    const body = createParams(data);

    const response = await Axios.post(Apis.startJob, body, head);
    return response;
  },
  getTechnicians: async () => {
    const head = getHeader();
    const response = await Axios.post(`${URL}/getTechnicians`, null, head);
    return response;
  },
  assignJob: async (data) => {
    const head = getHeader();
    const body = createParams(data);

    const response = await Axios.post(`${URL}/editJob`, body, head);
    return response;
  },
  updateJob: async (data) => {
    const head = getHeader();
    const body = createParams(data);

    const response = await Axios.post(Apis.updateJob, body, head);
    return response;
  },
  getLocationDetails: async (data: any) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.getLocationDetail, body, getHeader());
    return response;
  },
  getLocationTags: async () => {
    const response = await Axios.post(Apis.getLocationTags, undefined, getHeader());
    return { status: response.data.status, tags: response.data.tags };
  },
  getLocationTagJobs: async (data: any) => {
    const body = createParams(data);
    const response = await Axios.post(`${URL}/getLocationTagJobs`, body, getHeader());
    return response;
  },
  getEquipmentDetails: async (data) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.getEquipmentDetail, body, getHeader());
    return response;
  },
  getEquipmentPurchaseOrder: async (data) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.getEquipmentPurchaseOrder, body, getHeader());
    return response;
  },
  getTechnicianJobs: async (data: any) => {
    const body = createParams(data);
    const response = await Axios.post(`${URL}/getTechnicianJobs`, body, getHeader());
    return response;
  },
  getEquipmentJobs: async (data) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.getEquipmentJob, body, getHeader());
    return response;
  },
  scanJobEquipment: async (data) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.scanJobEquipment, body, getHeader());
    return response;
  },
  getTechnicianJobsToday: async () => {
    const head = getHeader();
    const body = createParams({ employeeId: store.getState().UserReducer.profile._id });
    const response = await Axios.post(`${URL}/getTechnicianJobsToday`, body, head);
    return response;
  },
  getJobSite: async (id: string) => {
    const response = await Axios.get(`${URL}/JobSite/${id}`);

    return response;
  },
  getJobLocation: async (id: string) => {
    const response = await Axios.get(`${URL}/JobLocation/${id}`);

    return response;
  },
  getJobSites: async (params: { locationId: string, customerId: string }) => {
    const urlParams = new URLSearchParams();
    urlParams.append('locationId', params.locationId);
    urlParams.append('customerId', params.customerId);
    const response = await Axios.get(Apis.getJobSites, { params: urlParams });

    return response;
  },
  getJobLocations: async (params: { companyId: string, customerId: string }) => {
    const urlParams = new URLSearchParams();
    urlParams.append('companyId', params.companyId);
    urlParams.append('customerId', params.customerId);
    const response = await Axios.get(Apis.getJobLocations, { params: urlParams });

    return response;
  },
  getJobDetails: async (data: any) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.getJobDetail, body, getHeader());
    return response;
  },
  getGroups: async () => {
    const response = await Axios.post(Apis.getGroups, null, getHeader());
    return response;
  },
  getCompanyEquipment: async () => {
    const response = await Axios.post(Apis.getCompanyEquipment, null, getHeader());
    return response;
  },
  getCustomers: () => new Promise((resolve, reject) => {
    const body = createParams({
      includeActive: true,
      includeNonActive: false,
    });
    Axios.post(`${URL}/getCustomers`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data.customers);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  createServiceTicket: (customerId, note, scheduleDate) => new Promise((resolve, reject) => {
    const { profile } = store.getState().UserReducer;
    const body = createParams({
      customerId,
      note,
      technicianId: profile._id,
      scheduleDate,
    });
    Axios.post(`${URL}/createServiceTicket`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  getServiceTickets: () => new Promise((resolve, reject) => {
    const body = createParams({});
    Axios.post(`${URL}/getServiceTickets`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          const { serviceTickets } = response.data;
          const len = serviceTickets.length;
          if (len > 0) {
            const subtickets = len > 50
              ? serviceTickets.slice(len - 50).reverse()
              : serviceTickets.reverse();
            resolve(subtickets);
          } else {
            reject({ message: 'Nothing available Ticket at this time.' });
          }
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  createPurchaseOrder: (data) => new Promise((resolve, reject) => {
    const body = createParams(data);
    Axios.post(`${URL}/createPurchaseOrder`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  getServiceTicketDetail: (ticketId) => new Promise((resolve, reject) => {
    const body = createParams({ ticketId });
    Axios.post(`${URL}/getServiceTicketDetail`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data.jobs);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  getCompanyContracts: () => new Promise((resolve, reject) => {
    const body = createParams({});
    Axios.post(`${URL}/getCompanyContracts`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          const contracts = response.data.contracts.map((contract) => ({
            _id: contract.contractor._id,
            profile: {
              displayName: contract.contractor.info.companyName,
            },
          }));
          resolve(contracts);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  getAllEmployees: () => new Promise((resolve, reject) => {
    const body = createParams({});
    Axios.post(`${URL}/getAllEmployees`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data.company.admin);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  createJob: (data) => new Promise((resolve, reject) => {
    const body = createParams(data);
    Axios.post(`${URL}/createJob`, body, getHeader())
      .then((response) => {
        if (response.data.status == 1) {
          resolve(response.data.serviceTickets);
        } else {
          reject({ message: response.data.message });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }),
  createCustomer: (data) => new Promise((resolve, reject) => {
    const body = createParams(data);
    Axios.post(`${URL}/createCustomer`, body, getHeader())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  }),
  getCustomerDetail: async (data: any) => {
    const body = createParams(data);
    const response = await Axios.post(Apis.getCustomerDetail, body, getHeader());
    return response;
  },
  getEquipmentTypes: async () => {
    const response = await Axios.post(`${URL}/getEquipmentTypes`, null, getHeader());
    return response;
  },
  getEquipmentBrands: async () => {
    const response = await Axios.post(`${URL}/getEquipmentBrands`, null, getHeader());
    return response;
  },
  createCustomerEquipment: async (data) => {
    const body = createParams(data);
    const response = await Axios.post(
      `${URL}/createCustomerEquipment`,
      body,
      getHeader(),
    );
    return response;
  },
  getCustomerEquipmentJobs: async (data: any) => {
    const body = createParams(data);
    const response = await Axios.post(
      `${URL}/getCustomerEquipmentJobs`,
      body,
      getHeader(),
    );

    return response;
  },
};
