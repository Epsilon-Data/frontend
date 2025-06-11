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
const Logout = React.lazy(() => import('./Logout'));
const Login = React.lazy(() => import('./Login'));

const AccessTokensPage = React.lazy(() => import('@app/pages/DashboardPages/AccessTokensPage/AccessTokensPage'));
const ConnectionRequestsPage = React.lazy(() => import('@app/pages/ConnectionRequestPages/ConnectionRequestsPage'));
const CreateRequestPage = React.lazy(
  () => import('@app/pages/ConnectionRequestPages/CreateRequestPage/CreateRequestPage'),
);
const ViewRequestPage = React.lazy(() => import('@app/pages/ConnectionRequestPages/ViewRequestPage/ViewRequestPage'));
const EditRequestPage = React.lazy(() => import('@app/pages/ConnectionRequestPages/EditRequestPage/EditRequestPage'));
const ApproveRequestPage = React.lazy(
  () => import('@app/pages/ConnectionRequestPages/ApproveRequestPage/ApproveRequestPage'),
);

const AccessRequestsPage = React.lazy(() => import('@app/pages/AccessRequestPages/AccessRequestsPage'));
const ViewAccessRequestPage = React.lazy(() => import('@app/pages/AccessRequestPages/ViewRequestPage/ViewRequestPage'));

const SourceListPage = React.lazy(() => import('@app/pages/DatasourcePages/SourceListPage'));
const DatabaseMappingPage = React.lazy(() => import('@app/pages/DatasourcePages/DatabaseMapping/DatabaseMappingPage'));
const DatabaseSummaryPage = React.lazy(
  () => import('@app/pages/DatasourcePages/DatabaseSummaryPage/DatabaseSummaryPage'),
);
const TableInfoPage = React.lazy(() => import('@app/pages/DatasourcePages/TableInfoPage/TableInfoPage'));
const DescribeDatasetPage = React.lazy(
  () => import('@app/pages/DatasourcePages/DescribeDatasetPage/DescribeDatasetPage'),
);
const CreateTemplatePage = React.lazy(
  () => import('@app/pages/DatasourcePages/DescribeDatasetPage/CreateTemplatePage/CreateTemplatePage'),
);
const AccessPermissionsPage = React.lazy(
  () => import('@app/pages/DatasourcePages/AccessPermissionsPage/AccessPermissionsPage'),
);
const OtherSettingsPage = React.lazy(() => import('@app/pages/DatasourcePages/OtherSettingsPage/OtherSettingsPage'));

const DatasetListPage = React.lazy(() => import('@app/pages/DatasetPages/DatasetListPage'));
const AnalysisPage = React.lazy(() => import('@app/pages/DatasetPages/AnalysisPage/AnalysisPage'));
const AnalysisViewPage = React.lazy(
  () => import('@app/pages/DatasetPages/AnalysisPage/AnalysisViewPage/AnalysisViewPage'),
);
const AnalysisUploadPage = React.lazy(
  () => import('@app/pages/DatasetPages/AnalysisPage/AnalysisUploadPage/AnalysisUploadPage'),
);
const StandardAnalysesPage = React.lazy(
  () => import('@app/pages/DatasetPages/StandardAnalysesPage/StandardAnalysesPage'),
);

const BrowseDatasetPage = React.lazy(() => import('@app/pages/BrowseDatasetPages/BrowseDatasetPage'));
const DatasetInfoPage = React.lazy(() => import('@app/pages/BrowseDatasetPages/DatasetInfoPage/DatasetInfoPage'));
const RequestAccessPage = React.lazy(() => import('@app/pages/BrowseDatasetPages/RequestAccessPage/RequestAccessPage'));
const SearchDatasetPage = React.lazy(() => import('@app/pages/BrowseDatasetPages/SearchDatasetPage/SearchDatasetPage'));

export const DASHBOARD_PATH = '/';

const Dashboard = withLoading(DashboardPage);
const AccessTokens = withLoading(AccessTokensPage);

const ConnectionRequests = withLoading(ConnectionRequestsPage);
const CreateRequest = withLoading(CreateRequestPage);
const ViewRequest = withLoading(ViewRequestPage);
const ApproveRequest = withLoading(ApproveRequestPage);
const EditRequest = withLoading(EditRequestPage);

const AccessRequests = withLoading(AccessRequestsPage);
const ViewAccessRequest = withLoading(ViewAccessRequestPage);

const SourceList = withLoading(SourceListPage);
const DatabaseMapping = withLoading(DatabaseMappingPage);
const DatabaseSummary = withLoading(DatabaseSummaryPage);
const TableInfo = withLoading(TableInfoPage);
const DescribeDataset = withLoading(DescribeDatasetPage);
const CreateTemplate = withLoading(CreateTemplatePage);
const AccessPermissions = withLoading(AccessPermissionsPage);
const OtherSettings = withLoading(OtherSettingsPage);

const DatasetList = withLoading(DatasetListPage);
const Analysis = withLoading(AnalysisPage);
const AnalysisView = withLoading(AnalysisViewPage);
const AnalysisUpload = withLoading(AnalysisUploadPage);
const StandardAnalyses = withLoading(StandardAnalysesPage);

const BrowseDatasets = withLoading(BrowseDatasetPage);
const DatasetInfo = withLoading(DatasetInfoPage);
const RequestAccess = withLoading(RequestAccessPage);
const SearchDatasets = withLoading(SearchDatasetPage);

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
          <Route path="project/db-mapping" element={<DatabaseMapping />} />
          <Route path="settings/pat" element={<AccessTokens />} />
          <Route path="requests/database/:page" element={<ConnectionRequests />} />
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
          <Route path="browse/summary/:id" element={<DatasetInfo />} />
          <Route path="browse/access/:id/:page" element={<RequestAccess mode="create" />} />
          <Route path="browse/search" element={<SearchDatasets />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginFallback />} />
          {/* <Route path="sign-up" element={<SignUpPage />} /> */}
          {/* <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} /> */}
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
