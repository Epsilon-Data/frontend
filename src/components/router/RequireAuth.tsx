import { ReactElement, useEffect, useMemo, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';
import { getClaims, handleAuth } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { ApiErrorData } from '@app/api/ApiError';
import { deletePreviousUrl, persistPreviousUrl } from '@app/services/localStorage.service';
import { Spin } from 'antd';

const AUTH_PARAM_KEYS = new Set(['code', 'state', 'session_state', 'error', 'iss', 'client_state']);

// for removing AUTH variables from query
function stripAuthParams(urlString: string): string {
  const url = new URL(urlString, window.location.origin);
  AUTH_PARAM_KEYS.forEach((k) => url.searchParams.delete(k));
  const qs = url.searchParams.toString();
  return `${url.pathname}${qs ? `?${qs}` : ''}${url.hash}`;
}

const RequireAuth = ({ children }: WithChildrenProps): ReactElement | null => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { csrf, initialized } = useAppSelector((state) => state.auth);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const hasAuthParams = useMemo(() => Array.from(query.keys()).some((k) => AUTH_PARAM_KEYS.has(k)), [query]);

  // Refs for lifecycle and idempotency
  const isMountedRef = useRef(true);
  const claimsFetchedRef = useRef(false);
  const handledQueryRef = useRef<string | null>(null);

  // Track mount/unmount only (doesn't flip on dependency changes)
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // If CSRF exists, fetch claims once
  useEffect(() => {
    if (!csrf) return;
    if (claimsFetchedRef.current) return;
    claimsFetchedRef.current = true;
    void dispatch(getClaims());
  }, [csrf, dispatch]);

  // If CSRF doesn't exist auth params do
  useEffect(() => {
    if (csrf) return; // claims path handles the post-auth case
    if (!hasAuthParams) return; // return if no authParams

    // check if query is already handled
    const currentSearch = location.search;
    if (handledQueryRef.current === currentSearch) return;
    handledQueryRef.current = currentSearch;

    // handle authentication
    (async () => {
      try {
        const res = await dispatch(handleAuth(query)).unwrap();
        // return if already mounted
        if (!isMountedRef.current) return;

        // check if login handled
        if (res.isLoggedIn && res.handled) {
          // cleanup url
          const cleanedCurrent = stripAuthParams(window.location.href);
          window.history.replaceState({}, document.title, cleanedCurrent);

          const target = stripAuthParams(res.previousUrl || '/');
          deletePreviousUrl();
          navigate(target, { replace: true });
          return;
        }

        // If not logged in after handling, navigate to login
        navigate('/auth/login', { replace: true });
      } catch (err) {
        // catch errors
        if (!isMountedRef.current) return;
        notificationController.error({
          title: (err as ApiErrorData)?.message ?? 'Authentication failed',
        });
        const cleanedCurrent = stripAuthParams(window.location.href);
        window.history.replaceState({}, document.title, cleanedCurrent);
        navigate('/auth/login', { replace: true });
      }
    })();
  }, [csrf, hasAuthParams, query, dispatch, navigate, location.search]);

  // render - if authenticated context (csrf exists), wait for claims before rendering children
  if (!csrf && !hasAuthParams) {
    // Save the current URL so we can redirect back after login
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;
    if (currentUrl !== '/auth/login') {
      persistPreviousUrl(currentUrl);
    }
    return <Navigate to="/auth/login" replace />;
  }

  // Wait for claims to resolve before rendering children to prevent race conditions
  if (csrf && !initialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return csrf ? <>{children}</> : null;
};

export default RequireAuth;
