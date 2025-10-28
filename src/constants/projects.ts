import { ProjectInfo } from '@app/api/projects.api';

export const PROJECT_API_URL = '/hub/project';
const STORAGE_KEY = 'app.currentProject';

export const DB_TYPE_LABELS: Record<string, string> = {
  postgres: 'dbTypeLabels.relational',
  mysql: 'dbTypeLabels.relational',
  mongodb: 'dbTypeLabels.document',
  neo4j: 'dbTypeLabels.graph',
  csv: 'dbTypeLabels.flatFile',
};

export const SEARCH_FIELDS = [];

export function saveToStorage(value: { projectId: string | null; project: ProjectInfo | null }) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}
export function loadFromStorage(): { projectId: string | null; project: ProjectInfo | null } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { projectId: null, project: null };
    return JSON.parse(raw);
  } catch {
    return { projectId: null, project: null };
  }
}
