import React from 'react';
import { Outlet, useSearchParams, Navigate, useLocation } from 'react-router-dom';
import { ProjectProvider } from '@app/providers/ProjectProvider';

export default function ProjectRouteScope() {
  const [params] = useSearchParams();
  const location = useLocation();
  const projectId = params.get('id');

  if (!projectId) {
    return <Navigate to="/" state={{ from: location, reason: 'missing-project-id' }} replace />;
  }

  return (
    <ProjectProvider initialProjectId={projectId}>
      <Outlet />
    </ProjectProvider>
  );
}
