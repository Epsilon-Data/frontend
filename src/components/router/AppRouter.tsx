import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from '@app/components/layouts/AuthLayout/AuthLayout';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DashboardPage from '@app/pages/DashboardPages/DashboardPage';
import ProjectLayout from './ProjectLayout';
import Logout from './Logout';
import Login from './Login';
import DatabaseMappingPage from '@app/pages/ProjectDetailsPages/DatabaseMappingPage';
import BrowseDatasetPage from '@app/pages/BrowseDatasetPages/BrowseDatasetPage';
import MetadataPage from '@app/pages/ProjectDetailsPages/MetadataPage';
import SettingsPage from '@app/pages/ProjectDetailsPages/SettingsPage';
import TrackRequestsPage from '@app/pages/BrowseDatasetPages/TrackRequestsPage';
import ProjectAccessPage from '@app/pages/ProjectDetailsPages/ProjectAccessPage';
import ErrorPage from '@app/pages/ErrorPages/ErrorPage';
import ProtectedLayout from './ProtectedLayout';

export const DASHBOARD_PATH = '/';

const Dashboard = withLoading(DashboardPage);
const DatabaseMapping = withLoading(DatabaseMappingPage);
const Metadata = withLoading(MetadataPage);
const Access = withLoading(ProjectAccessPage);
const Settings = withLoading(SettingsPage);
const BrowseDatasets = withLoading(BrowseDatasetPage);
const TrackRequests = withLoading(TrackRequestsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);
const LoginFallback = withLoading(Login);

const ErrorFallback = withLoading(ErrorPage);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={DASHBOARD_PATH} element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<BrowseDatasets />} />
          <Route path="track-requests" element={<TrackRequests />} />
        </Route>
        <Route path="project" element={<ProjectLayout />}>
          <Route path="db-mapping" element={<DatabaseMapping />} />
          <Route path="metadata" element={<Metadata />} />
          <Route path="access" element={<Access />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginFallback />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
        <Route path="/error" element={<ProtectedLayout hideSider />}>
          <Route index element={<ErrorFallback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
