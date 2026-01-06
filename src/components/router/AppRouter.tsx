import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from '@app/components/layouts/AuthLayout/AuthLayout';
import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DashboardPage from '@app/pages/DashboardPages/DashboardPage';
import ProjectLayout from './ProjectLayout';
import Logout from './Logout';
import Login from './Login';
import DatabaseMappingPage from '@app/pages/ProjectDetailsPages/DatabaseMappingPage';
import BrowseDatasetPage from '@app/pages/BrowseDatasetPages/BrowseDatasetPage';
import MetadataPage from '@app/pages/ProjectDetailsPages/MetadataPage';
import TeamPage from '@app/pages/ProjectDetailsPages/TeamPage';
import TrackRequestsPage from '@app/pages/BrowseDatasetPages/TrackRequestsPage';

export const DASHBOARD_PATH = '/';

const Dashboard = withLoading(DashboardPage);
const DatabaseMapping = withLoading(DatabaseMappingPage);
const Metadata = withLoading(MetadataPage);
const Team = withLoading(TeamPage);
const BrowseDatasets = withLoading(BrowseDatasetPage);
const TrackRequests = withLoading(TrackRequestsPage);

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
          <Route path="track-requests" element={<TrackRequests />} />
        </Route>
        <Route path="project" element={protectedProjectLayout}>
          <Route path="db-mapping" element={<DatabaseMapping />} />
          <Route path="metadata" element={<Metadata />} />
          <Route path="team" element={<Team />} />
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginFallback />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
      </Routes>
    </BrowserRouter>
  );
};
