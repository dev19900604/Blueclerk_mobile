//development
// const BASE_URL = 'https://blueclerk-node-api.deploy.blueclerk.com';
//production
const BASE_URL = 'https://api.blueclerk.com/';
export const URL = `${BASE_URL}api/v1`;
export const ImgURl = BASE_URL;

export const Apis = {
  Signup: `${URL}/signUp`,
  SocialSignup: `${URL}/signUpSocial`,
  Login: `${URL}/login`,
  forgotPassword: `${URL}/forgotPassword`,
  getIndustries: `${URL}/getIndustries`,
  getTechJobs: `${URL}/getTechnicianJobs`,
  getJobs: `${URL}/getJobs`,
  startJob: `${URL}/startJob`,
  updateJob: `${URL}/updateJob`,
  getJobSites: `${URL}/jobSite`,
  getJobLocations: `${URL}/jobLocation`,
  getLocationDetail: `${URL}/getLocationTagJobs`,
  getLocationTags: `${URL}/getLocationTags`,
  getLocationTagJobs: `${URL}/getLocationTagJobs`,
  getEquipmentDetail: `${URL}/getEquipmentInfo`,
  getEquipmentPurchaseOrder: `${URL}/getEquipmentPurchaseOrder`,
  getEquipmentJob: `${URL}/getEquipmentJobs`,
  getCustomerEquipmentJobs: `${URL}/getCustomerEquipmentJobs`,
  scanJobEquipment: `${URL}/scanJobEquipment`,
  getJobDetail: `${URL}/getJobDetails`,
  getGroups: `${URL}/getGroups`,
  getTechnicianJobs: `${URL}/getTechnicianJobs`,
  getTechnicianJobsToday: `${URL}/getTechnicianJobsToday`,
  getCompanyEquipment: `${URL}/getCompanyEquipments`,
  getCustomerDetail: `${URL}/getCustomerDetail`,
  agreeTerms: `${URL}/agreeTermAndCondition`,
};

export const HeaderSend = {
  SetHeaders: (token: any) => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return headers;
  },
};
