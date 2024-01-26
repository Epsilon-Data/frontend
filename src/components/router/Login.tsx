import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doLogin } from '@app/store/slices/authSlice';

const Login: React.FC = () => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleLogin();
  }, []);
  // return <Navigate to="/auth/login" replace />;

  const handleLogin = () => {
    dispatch(doLogin())
      .unwrap()
      .then((res) => (window.location.href = res))
      .catch((err: unknown) => {
        // notificationController.error({ message: err.message });
        // setLoading(false);
        console.log(err);
      });
  };

  return <br></br>;
};

export default Login;
