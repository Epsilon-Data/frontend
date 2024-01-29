import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
// import { Navigate } from 'react-router-dom';
import { doLogout } from '@app/store/slices/authSlice';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = () => {
    dispatch(doLogout())
      .unwrap()
      .then((res) => {
        window.location.href = res;
      })
      .catch((err: unknown) => {
        // notificationController.error({ message: err.message });
        // setLoading(false);
        console.log(err);
      });
  };

  // return <Navigate to="/auth/login" replace />;
  return null;
};

export default Logout;
