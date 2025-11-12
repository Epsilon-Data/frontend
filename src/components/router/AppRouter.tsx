import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
// import LoginPage from '@app/pages/LoginPage';
// import SignUpPage from '@app/pages/SignUpPage';
// import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
// import SecurityCodePage from '@app/pages/SecurityCodePage';
// import NewPasswordPage from '@app/pages/NewPasswordPage';
// import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DashboardPage from '@app/pages/DashboardPages/DashboardPage';
import ProjectLayout from './ProjectLayout';

const Logout = React.lazy(() => import('./Logout'));
const Login = React.lazy(() => import('./Login'));
const DatabaseMappingPage = React.lazy(() => import('@app/pages/ProjectDetailsPages/DatabaseMappingPage'));
const BrowseDatasetPage = React.lazy(() => import('@app/pages/BrowseDatasetPages/BrowseDatasetPage'));
const MetadataPage = React.lazy(() => import('@app/pages/ProjectDetailsPages/MetadataPage'));

export const DASHBOARD_PATH = '/';

const Dashboard = withLoading(DashboardPage);
const DatabaseMapping = withLoading(DatabaseMappingPage);
const Metadata = withLoading(MetadataPage);
const BrowseDatasets = withLoading(BrowseDatasetPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);
const LoginFallback = withLoading(Login);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  const protectedProjectLayout = (
    <RequireAuth>
      <ProjectLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<BrowseDatasets />} />
        </Route>
        <Route path="project" element={protectedProjectLayout}>
          <Route path="db-mapping" element={<DatabaseMapping />} />
          <Route path="metadata" element={<Metadata />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginFallback />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
