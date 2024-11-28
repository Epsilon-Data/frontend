/* eslint-disable @typescript-eslint/no-explicit-any */
import { RcFile } from 'antd/es/upload';
import { getCsrfHeader, httpClient } from './http.api';
import { SCRIPT_API_URL } from '@app/constants/script';

export const uploadScript = async (analysisId: string | undefined, file: string | Blob | RcFile): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const formData = new FormData();
  formData.append('file', file);
  const response = await httpClient.post(`${SCRIPT_API_URL}/${analysisId}`, formData, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const deleteScript = async (scriptId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${SCRIPT_API_URL}/${scriptId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getScriptMapping = async (scriptId: string | undefined): Promise<any> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${SCRIPT_API_URL}/${scriptId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const addScriptMapping = async (scriptId: string | undefined, mapping: any): Promise<any> => {
  const jsonMapping = JSON.stringify(mapping);
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    `${SCRIPT_API_URL}/${scriptId}/mapping`,
    { data: jsonMapping },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};
