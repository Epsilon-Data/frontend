import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { Navigate } from 'react-router-dom';
import { doLogin } from '@app/store/slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(doLogin());
  }, [dispatch]);

  return <Navigate to="/" replace />;
};

export default Login;
