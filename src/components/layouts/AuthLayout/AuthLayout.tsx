import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full bg-black relative">
        <div className="flex flex-col items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
