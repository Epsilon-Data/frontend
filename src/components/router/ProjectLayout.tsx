import { useSearchParams, Navigate, useLocation } from 'react-router-dom';
import { ProjectProvider } from '@app/providers/ProjectProvider';
import MainLayout from '../layouts/main/MainLayout/MainLayout';
import RequireAuth from './RequireAuth';

export default function ProjectLayout() {
  const [params] = useSearchParams();
  const location = useLocation();
  const projectId = params.get('id');

  if (!projectId) {
    return <Navigate to="/" state={{ from: location, reason: 'missing-project-id' }} replace />;
  }

  return (
    <RequireAuth>
      <ProjectProvider initialProjectId={projectId}>
        <MainLayout />
      </ProjectProvider>
    </RequireAuth>
  );
}
