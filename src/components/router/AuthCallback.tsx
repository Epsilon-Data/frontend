import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { handleAuth } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { ApiErrorData } from '@app/api/ApiError';
import { deletePreviousUrl, readPreviousUrl } from '@app/services/localStorage.service';
import { stripAuthParams } from './RequireAuth';
import { Spin } from 'antd';

/**
 * Dedicated OAuth callback route (/auth/callback).
 *
 * Keycloak redirects here with code/state after login, so the token exchange
 * never appears on content routes and the route can be excluded from proxy
 * access logs. After the exchange, the user is sent to the URL persisted
 * before login (persistPreviousUrl in RequireAuth), falling back to `/`.
 */
const AuthCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handledRef = useRef(false);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    // Reached without an OAuth response (e.g. navigated here directly, or the
    // token handler still redirects to `/` and RequireAuth already handled the
    // exchange) — nothing to exchange, just go home.
    if (!query.get('code') || !query.get('state')) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await dispatch(handleAuth(query)).unwrap();

        if (res.isLoggedIn && res.handled) {
          const previousUrl = readPreviousUrl();
          deletePreviousUrl();
          // Never bounce back into auth routes; strip any stray auth params
          const target = previousUrl && !previousUrl.startsWith('/auth') ? stripAuthParams(previousUrl) : '/';
          navigate(target, { replace: true });
          return;
        }

        navigate('/auth/login', { replace: true });
      } catch (err) {
        notificationController.error({
          title: (err as ApiErrorData)?.message ?? 'Authentication failed',
        });
        navigate('/auth/login', { replace: true });
      }
    })();
  }, [dispatch, navigate, query]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );
};

export default AuthCallback;
