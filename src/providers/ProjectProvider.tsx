import { getProjectDetails, ProjectInfo } from '@app/api/projects.api';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProjectContext } from '@app/context/Project';

export function ProjectProvider({
  children,
  initialProjectId = null,
}: {
  children: React.ReactElement[] | React.ReactElement;
  initialProjectId?: string | null;
}) {
  const lastFetchedId = useRef<string | null>(null);
  const [{ projectId, project }, setState] = useState<{
    projectId: string | null;
    project: ProjectInfo | null;
  }>({ projectId: initialProjectId, project: null });

  const [projectLoading, setProjectLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const setProjectId = useCallback((id: string | null) => {
    setState((prev) => ({ projectId: id, project: id === prev.projectId ? prev.project : null }));
  }, []);

  const updateProjectLocally = useCallback((updater: (prev: ProjectInfo | null) => ProjectInfo | null) => {
    setState((prev) => ({ ...prev, project: updater(prev.project) }));
  }, []);

  const refresh = useCallback(async () => {
    if (!projectId || lastFetchedId.current === projectId) return;
    setProjectLoading(true);
    setError(null);
    try {
      const data = await getProjectDetails(projectId);
      lastFetchedId.current = projectId;
      setState((prev) => ({ projectId: prev.projectId, project: data }));
    } catch (err) {
      setError(err);
    } finally {
      setProjectLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    lastFetchedId.current = null;
    void refresh();
  }, [projectId, refresh]);

  const value = useMemo(
    () => ({ projectId, project, projectLoading, error, setProjectId, refresh, updateProjectLocally }),
    [projectId, project, projectLoading, error, setProjectId, refresh, updateProjectLocally],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
