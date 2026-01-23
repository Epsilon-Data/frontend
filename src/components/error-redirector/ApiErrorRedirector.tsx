import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { errorBus, ApiErrorEvent } from '@app/api/http.api';
import { useError } from '@app/context/Error';

const ERROR_PATH = '/error';

const shouldRedirect = (e: ApiErrorEvent) => {
  if (!e.status) return true;
  if (e.status === 401) return false;
  if (e.status === 403) return true;
  if (e.status === 404) return true;
  if (typeof e.status === 'number' && e.status >= 500) return true;
  return true;
};

export const ApiErrorRedirector: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setError } = useError();

  useEffect(() => {
    const unsub = errorBus.on((payload: ApiErrorEvent) => {
      if (location.pathname === ERROR_PATH) return;

      setError(payload);

      if (shouldRedirect(payload)) {
        navigate(ERROR_PATH, {
          replace: true,
          state: { from: location.pathname },
        });
      }
    });

    return () => unsub();
  }, [navigate, location.pathname, setError]);

  return null;
};
