import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
// import { Navigate } from 'react-router-dom';
import { doLogout } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(doLogout())
      .unwrap()
      .then((res) => (window.location.href = res))
      .catch((err) => {
        notificationController.error({ title: err.message });
      });
  }, [dispatch]);

  // return <Navigate to="/auth/login" replace />;
  return null;
};

export default Logout;
