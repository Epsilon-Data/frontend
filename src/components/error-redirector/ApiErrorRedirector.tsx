import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { errorBus, ApiErrorEvent } from '@app/api/http.api';
import { useError } from '@app/context/Error';
import { useProjectOptional } from '@app/hooks/useProjectContext';

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
  const projectContext = useProjectOptional();
  const project = projectContext?.project;

  useEffect(() => {
    const unsub = errorBus.on((payload: ApiErrorEvent) => {
      if (location.pathname === ERROR_PATH) return;

      setError(payload);

      if (shouldRedirect(payload)) {
        // If project is in ERROR state, don't redirect to error page
        // instead keep the user on the current page showing the FallbackState component
        if (project?.status === 'ERROR') {
          return;
        }

        navigate(ERROR_PATH, {
          replace: true,
          state: { from: location.pathname },
        });
      }
    });

    return () => unsub();
  }, [navigate, location.pathname, setError, project?.status]);

  return null;
};
