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

const NewsFeedPage = React.lazy(() => import('@app/pages/NewsFeedPage'));
const DataTablesPage = React.lazy(() => import('@app/pages/DataTablesPage'));
const AdvancedFormsPage = React.lazy(() => import('@app/pages/AdvancedFormsPage'));
const Logout = React.lazy(() => import('./Logout'));

const OAConnectionRequestsPage = React.lazy(() => import('@app/pages/orgAdmin/ConnectionRequestsPage'));
const RConnectionRequestsPage = React.lazy(() => import('@app/pages/researcher/ConnectionRequestsPage'));
const CreateRequestPage = React.lazy(() => import('@app/pages/researcher/CreateRequestPage/CreateRequestPage'));
const ViewRequestPage = React.lazy(() => import('@app/pages/researcher/ViewRequestPage/ViewRequestPage'));
const EditRequestPage = React.lazy(() => import('@app/pages/researcher/EditRequestPage/EditRequestPage'));

const SourceListPage = React.lazy(() => import('@app/pages/researcher/SourceListPage'));

export const MEDICAL_DASHBOARD_PATH = '/';
export const NFT_DASHBOARD_PATH = '/nft-dashboard';

const MedicalDashboard = withLoading(MedicalDashboardPage);
const NewsFeed = withLoading(NewsFeedPage);
const AdvancedForm = withLoading(AdvancedFormsPage);

const DataTables = withLoading(DataTablesPage);

const OAConnectionRequests = withLoading(OAConnectionRequestsPage);
const RConnectionRequests = withLoading(RConnectionRequestsPage);
const CreateRequest = withLoading(CreateRequestPage);
const ViewRequest = withLoading(ViewRequestPage);

// Edit Request
const EditRequest = withLoading(EditRequestPage);

const SourceList = withLoading(SourceListPage);

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
          <Route path="apps">
            <Route path="feed" element={<NewsFeed />} />
          </Route>
          <Route path="forms">
            <Route path="advanced-forms" element={<AdvancedForm />} />
          </Route>
          <Route path="oa-connection-requests" element={<OAConnectionRequests />} />
          <Route path="r-connection-requests" element={<RConnectionRequests />} />
          <Route path="r-connection-requests/create/:page" element={<CreateRequest />} />
          <Route path="r-connection-requests/view/:id" element={<ViewRequest />} />
          <Route path="r-connection-requests/edit/:id/:page" element={<EditRequest />} />
          <Route path="database-sources" element={<SourceList />} />
          <Route path="data-tables" element={<DataTables />} />
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
