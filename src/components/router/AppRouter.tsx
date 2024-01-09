import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import SecurityCodePage from '@app/pages/SecurityCodePage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import MedicalDashboardPage from '@app/pages/DashboardPages/MedicalDashboardPage';
const Logout = React.lazy(() => import('./Logout'));

const OAConnectionRequestsPage = React.lazy(() => import('@app/pages/orgAdmin/ConnectionRequestsPage'));
const RConnectionRequestsPage = React.lazy(
  () => import('@app/pages/researcher/ConnectionRequest/ConnectionRequestsPage'),
);
const CreateRequestPage = React.lazy(
  () => import('@app/pages/researcher/ConnectionRequest/CreateRequestPage/CreateRequestPage'),
);
const ViewRequestPage = React.lazy(
  () => import('@app/pages/researcher/ConnectionRequest/ViewRequestPage/ViewRequestPage'),
);
const EditRequestPage = React.lazy(
  () => import('@app/pages/researcher/ConnectionRequest/EditRequestPage/EditRequestPage'),
);

const SourceListPage = React.lazy(() => import('@app/pages/researcher/DatabaseSource/SourceListPage'));
const MetadataPage = React.lazy(() => import('@app/pages/researcher/DatabaseSource/MetadataPage/MetadataPage'));
const DatabaseSummaryPage = React.lazy(
  () => import('@app/pages/researcher/DatabaseSource/DatabaseSummaryPage/DatabaseSummaryPage'),
);
// const TableInfoPage = React.lazy(() => import('@app/pages/researcher/DatabaseSource/TableInfoPage/TableInfoPage'));
// const DescribeDatasetPage = React.lazy(
//   () => import('@app/pages/researcher/DatabaseSource/DescribeDatasetPage/DescribeDatasetPage'),
// );
// const AccessPermissionsPage = React.lazy(
//   () => import('@app/pages/researcher/DatabaseSource/AccessPermissionsPage/AccessPermissionsPage'),
// );

export const MEDICAL_DASHBOARD_PATH = '/';
export const NFT_DASHBOARD_PATH = '/nft-dashboard';

const MedicalDashboard = withLoading(MedicalDashboardPage);

const OAConnectionRequests = withLoading(OAConnectionRequestsPage);
const RConnectionRequests = withLoading(RConnectionRequestsPage);
const CreateRequest = withLoading(CreateRequestPage);
const ViewRequest = withLoading(ViewRequestPage);

// Edit Request
const EditRequest = withLoading(EditRequestPage);

const SourceList = withLoading(SourceListPage);
const Metadata = withLoading(MetadataPage);
const DatabaseSummary = withLoading(DatabaseSummaryPage);
// const TableInfo = withLoading(TableInfoPage);
// const DescribeDataset = withLoading(DescribeDatasetPage);
// const AccessPermissions = withLoading(AccessPermissionsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={MEDICAL_DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<MedicalDashboard />} />
          <Route path="oa-connection-requests" element={<OAConnectionRequests />} />
          <Route path="r-connection-requests" element={<RConnectionRequests />} />
          <Route path="r-connection-requests/create/:page" element={<CreateRequest />} />
          <Route path="r-connection-requests/view/:id" element={<ViewRequest />} />
          <Route path="r-connection-requests/edit/:id/:page" element={<EditRequest />} />
          <Route path="database-sources" element={<SourceList />} />
          <Route path="database-sources/metadata/:id" element={<Metadata />} />
          <Route path="database-sources/metadata/:id/db-summary" element={<DatabaseSummary />} />
          {/* <Route path="database-sources/metadata/:id/table-info" element={<TableInfo />} /> */}
          {/* <Route path="database-sources/describe-dataset/:id" element={<DescribeDataset />} />
          <Route path="database-sources/access-permissions/:id" element={<AccessPermissions />} /> */}
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
