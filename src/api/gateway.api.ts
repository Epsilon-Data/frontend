import { httpClient } from '@app/api/http.api';

import config from '@app/config/config';
import { readCsrf } from '@app/services/localStorage.service';

export const gatewayTest = async () => {
  const csrf = readCsrf();
  const csrfHeaderName = `x-${config.cookiePrefix}-csrf`;
  await httpClient
    .get('/gateway/test', {
      headers: { [csrfHeaderName]: `${csrf}` },
    })
    .then((res: unknown) => console.log(res))
    .catch((e: unknown) => console.log(e));
};
