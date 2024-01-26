import { httpClient } from '@app/api/http.api';

export const test = async () => {
  httpClient.get('gateway').then(({ data }) => console.log(data));
};
