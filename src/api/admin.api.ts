import { httpClient, getCsrfHeader } from './http.api';

export const getUsers = async (): Promise<boolean> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/admin/users', {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getUser = async (id: string): Promise<boolean> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`/hub/admin/users/${id}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
