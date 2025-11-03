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
import ProjectRouteScope from './ProjectRouteScope';

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<BrowseDatasets />} />
          <Route path="project" element={<ProjectRouteScope />}>
            <Route path="db-mapping" element={<DatabaseMapping />} />
            <Route path="metadata" element={<Metadata />} />
          </Route>
          {/* <Route path="requests/database/:page" element={<ConnectionRequests />} />
          <Route path="requests/database/create/:page" element={<CreateRequest />} />
          <Route path="requests/database/view/:id" element={<ViewRequest />} />
          <Route path="requests/database/edit/:id/:page" element={<EditRequest />} />
          <Route path="requests/database/approve/:id" element={<ApproveRequest />} />
          <Route path="requests/user/:page" element={<AccessRequests />} />
          <Route path="requests/user/view/:id" element={<ViewAccessRequest />} />
          <Route path="requests/user/edit/:id/:page" element={<RequestAccess mode="edit" />} />
          <Route path="database-sources" element={<SourceList />} />
          <Route path="database-sources/metadata/:id/db-summary" element={<DatabaseSummary />} />
          <Route path="database-sources/metadata/:id/table-info" element={<TableInfo />} />
          <Route path="database-sources/describe-dataset/:id" element={<DescribeDataset />} />
          <Route path="database-sources/describe-dataset/:id/create" element={<CreateTemplate />} />
          <Route path="database-sources/access-permissions/:id" element={<AccessPermissions />} />
          <Route path="database-sources/other-settings/:id" element={<OtherSettings />} />
          <Route path="datasets" element={<DatasetList />} />
          <Route path="datasets/analysis/:id" element={<Analysis />} />
          <Route path="datasets/analysis/:id/view/:analysisId" element={<AnalysisView />} />
          <Route path="datasets/analysis/:id/view/:analysisId/upload/:scriptId" element={<AnalysisUpload />} />
          <Route path="datasets/standard/:id" element={<StandardAnalyses />} />
          <Route path="browse/access/:id/:page" element={<RequestAccess mode="create" />} />
          <Route path="browse/search" element={<SearchDatasets />} /> */}
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginFallback />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
