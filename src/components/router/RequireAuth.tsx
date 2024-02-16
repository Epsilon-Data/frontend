import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { WithChildrenProps } from '@app/types/generalTypes';
import { getClaims, handleAuth } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const search = useLocation().search;
  const csrf = useAppSelector((state) => state.auth.csrf);
  // get credentials and generate CSRF
  useEffect(() => {
    const query = new URLSearchParams(search);
    if (query && query.size) {
      dispatch(handleAuth(query))
        .unwrap()
        .then((res) => {
          if (res.isLoggedIn && res.handled) {
            navigate(res.previousUrl || '/', { replace: true });
            // window.location.href = res.previousUrl || '/';
          }
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
        });
    } else if (csrf !== '') {
      dispatch(getClaims());
    }
  }, [csrf, dispatch, navigate, search]);

  return csrf ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
