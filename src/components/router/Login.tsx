import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
// import { Navigate } from 'react-router-dom';
import { doLogin } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';

const Login: React.FC = () => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleLogin();
  }, []);

  const handleLogin = () => {
    dispatch(doLogin())
      .unwrap()
      .then((res) => {
        window.location.href = res;
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
      });
  };
  // return <Navigate to="/" replace />;
  return null;
};

export default Login;
