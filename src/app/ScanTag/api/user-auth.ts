import WebService from '../../../lib/web-service';
import { IServerResponse, ResponseModel } from '../../../interfaces/i-server-response';
import { IUser } from '../../../interfaces/i-user';
import { IIndustry } from '../stores/company-info-store';
import { URL } from '../../../config/apis';

type LoginResponse = IServerResponse<'user', IUser> & ResponseModel<'token', string>;

export function checkAndGetSocialLogin(socialId: string, type: 0 | 1) {
  const endpoint = `${URL}/checkAndGet`;
  return WebService.post<LoginResponse>(endpoint, {
    data: {
      socialId,
      connectorType: type,
    },
  });
}

export function fetchIndustries() {
  const endpoint = `${URL}/getIndustries`;
  return WebService.post<IServerResponse<'industries', IIndustry[]>>(endpoint);
}

export type SocialSignupParams = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  companyName: string;
  industryId: string;
  socialId: string;
  connectorType: SocialLoginType;
};

export function socialSignUp(data: SocialSignupParams) {
  const endpoint = `${URL}/signUpSocial`;

  return WebService.post<LoginResponse>(endpoint, { data });
}
