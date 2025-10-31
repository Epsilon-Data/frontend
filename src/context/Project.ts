import { ProjectInfo } from '@app/api/projects.api';
import { createContext } from 'react';

type ProjectContextType = {
  projectId: string | null;
  project: ProjectInfo | null;
  projectLoading: boolean;
  error: unknown;
  setProjectId: (id: string | null) => void;
  refresh: () => Promise<void>;
  updateProjectLocally: (updater: (prev: ProjectInfo | null) => ProjectInfo | null) => void;
} | null;

export const ProjectContext = createContext<ProjectContextType>(null);
