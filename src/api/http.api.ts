import { authClient, AuthClientOptionsDto } from '@epsilon-data/epsilon-auth-client';

import { AxiosRequestConfig } from 'axios';

import config from '@app/config/config';

const clientOptions: AuthClientOptionsDto = {
  tokenHandlerUri: `${config.apiPrefix}/token`,
  cookiePrefix: config.cookiePrefix,
  refreshExpiringTokens: true,
  refreshThresholdSeconds: 30,
  reauthenticateOnUnauthorizedError: true,
};

const httpClientOptions: AxiosRequestConfig = {
  // Use this to add any additional headers
  headers: {},
};

const { getLoginUrl, handlePageLoad, getUserInfo, getUserClaims, refreshToken, logout, httpClient } = authClient(
  clientOptions,
  httpClientOptions,
);

// export const httpApi = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
// });

// httpApi.interceptors.request.use((config) => {
//   config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` } as AxiosRequestHeaders;

//   return config;
// });

// httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
//   const responseData = error.response?.data as ApiErrorData;
//   throw new ApiError<ApiErrorData>(responseData?.message || error.message, responseData);
// });

// export interface ApiErrorData {
//   message: string;
// }

export { getLoginUrl, handlePageLoad, getUserInfo, getUserClaims, refreshToken, logout, httpClient };
