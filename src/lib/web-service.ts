import axios, { CancelToken } from 'axios';
import store from '../redux/store';

interface IRequestConfig {
  params?: any;
  data?: any;
  headers?: any;
  cancelToken?: CancelToken;
  requestWithStatus?: boolean;
  token?: string;
}

class WebService {
  public get<T>(url: string, config: IRequestConfig = {}) {
    return this.request<T>(WebMethods.GET, url, config);
  }

  public post<T>(url: string, config: IRequestConfig = {}) {
    return this.request<T>(WebMethods.POST, url, config);
  }

  public put<T>(url: string, config: IRequestConfig = {}) {
    return this.request<T>(WebMethods.PUT, url, config);
  }

  public delete<T>(url: string, config: IRequestConfig = {}) {
    return this.request<T>(WebMethods.DELETE, url, config);
  }

  public patch<T>(url: string, config: IRequestConfig = {}) {
    return this.request<T>(WebMethods.PATCH, url, config);
  }

  private request<T>(
    method: WebMethods,
    url: string,
    { 
      params = {},
      data = {},
      headers = {},
      cancelToken,
      token,
    }: IRequestConfig,
  ) {
    const config = this.getRequestConfig(
      method,
      params,
      data,
      headers,
      cancelToken,
      token,
    );

    return axios.request<T>({ method, url, ...config });
  }

  private getRequestConfig(
    method: WebMethods,
    params: any,
    data: any,
    headers: any,
    cancelToken?: CancelToken,
    authToken?: string,
  ) {
    const token = authToken || store.getState().UserReducer.token;
    const DefaultHeaders = {
      Accept: 'application/json',
      'Content-Type':
        data instanceof FormData ? 'multipart/form-data' : 'application/json',
      ...(token && { Authorization: token }),
    };
    return {
      params,
      ...(method !== WebMethods.GET && { data }),
      headers: { ...DefaultHeaders, ...headers },
      cancelToken,
    };
  }
}

enum WebMethods {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export default new WebService();
