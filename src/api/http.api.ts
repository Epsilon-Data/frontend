import axios, { AxiosRequestHeaders } from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';

export const httpApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` } as AxiosRequestHeaders;

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  const responseData = error.response?.data as ApiErrorData;
  throw new ApiError<ApiErrorData>(responseData?.message || error.message, responseData);
});

export interface ApiErrorData {
  message: string;
}
