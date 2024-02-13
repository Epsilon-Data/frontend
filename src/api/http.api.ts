import { authClient, AuthClientOptionsDto } from '@epsilon-data/epsilon-auth-client';

import { AxiosError, AxiosRequestConfig } from 'axios';

import config from '@app/config/config';
import { ApiError } from './ApiError';
import { readCsrf } from '@app/services/localStorage.service';

type ApiErrorData = {
  message: string;
};

const clientOptions: AuthClientOptionsDto = {
  tokenHandlerUri: `${config.apiPrefix}/token`,
  cookiePrefix: config.cookiePrefix,
  refreshExpiringTokens: true,
  refreshThresholdSeconds: 30,
  reauthenticateOnUnauthorizedError: true,
};

const httpClientOptions: AxiosRequestConfig = {
  baseURL: config.apiPrefix,
  // Use this to add any additional headers
  headers: {},
};

const getCsrfHeader = () => {
  return { csrfHeaderName: `x-${config.cookiePrefix}-csrf`, csrf: readCsrf() };
};

const { getLoginUrl, handlePageLoad, getUserInfo, getUserClaims, refreshToken, logout, httpClient } = authClient(
  clientOptions,
  httpClientOptions,
);

httpClient.interceptors.response.use(undefined, (error: AxiosError) => {
  const responseData = error.response?.data as ApiErrorData;
  throw new ApiError<ApiErrorData>(responseData?.message || error.message, responseData);
});

export {
  getLoginUrl,
  handlePageLoad,
  getUserInfo,
  getUserClaims,
  refreshToken,
  logout,
  httpClient,
  getCsrfHeader,
  ApiError,
};
