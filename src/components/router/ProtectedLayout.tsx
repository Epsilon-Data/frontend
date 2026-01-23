// ProtectedLayout.tsx
import React from 'react';
import RequireAuth from '@app/components/router/RequireAuth';
import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';

type ProtectedLayoutProps = {
  hideSider?: boolean;
};

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ hideSider }) => {
  return (
    <RequireAuth>
      <MainLayout hideSider={hideSider} />
    </RequireAuth>
  );
};

export default ProtectedLayout;
