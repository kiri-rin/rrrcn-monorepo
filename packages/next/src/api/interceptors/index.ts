import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export const createTokenInterceptor =
  (getToken: () => string | null, TOKEN_KEY: string, TOKEN_PREFIX: string) =>
  (request: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      request.headers[TOKEN_KEY] = TOKEN_PREFIX + token;
    }
    return request;
  };
export const createErrorInterceptor =
  (callback: (error: any) => any, errorCode?: number) =>
  (error: AxiosError) => {
    if (typeof errorCode !== "undefined") {
      if (error.response?.status === errorCode) {
        callback(error);
      }
    } else {
      callback(error);
    }
    return Promise.reject(error);
  };
export const catchResponseError = (
  axiosInstance: AxiosInstance,
  callback: (error: any) => any,
  errorCode?: number
) => {
  const interceptor = createErrorInterceptor(callback, errorCode);
  return axiosInstance.interceptors.response.use(
    (response) => response,
    interceptor
  );
};
export const placeTokenIntoRequests = (
  axiosInstance: AxiosInstance,
  getToken: () => string | null,
  TOKEN_KEY: string,
  TOKEN_PREFIX: string
) => {
  const interceptor = createTokenInterceptor(getToken, TOKEN_KEY, TOKEN_PREFIX);
  return axiosInstance.interceptors.request.use(interceptor);
};
