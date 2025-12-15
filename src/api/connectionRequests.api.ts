import { DatabaseConnectionDetails, DatabaseInfoFormValues } from '@app/interfaces/interfaces';
import { CONNECTION_REQUEST_API_URL } from '@app/constants/connectionRequest';
import { httpClient, getCsrfHeader } from './http.api';

export const approveRequest = async (data: DatabaseInfoFormValues, requestId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.patch(`${CONNECTION_REQUEST_API_URL}/${requestId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const testConnection = async (data: DatabaseConnectionDetails): Promise<unknown> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${CONNECTION_REQUEST_API_URL}/test`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
