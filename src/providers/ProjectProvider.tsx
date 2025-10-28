import { getProjectDetails, ProjectInfo } from '@app/api/projects.api';
import { loadFromStorage, saveToStorage } from '@app/constants/projects';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProjectContext } from '@app/context/Project';

export function ProjectProvider({
  children,
  initialProjectId = null,
}: {
  children: React.ReactElement[] | React.ReactElement;
  initialProjectId?: string | null;
}) {
  const mounted = useRef(false);
  const [{ projectId, project }, setState] = useState<{ projectId: string | null; project: ProjectInfo | null }>(() => {
    const stored = loadFromStorage();
    return {
      projectId: initialProjectId ?? stored.projectId,
      project: stored.projectId === (initialProjectId ?? stored.projectId) ? stored.project : null,
    };
  });

  const [projectLoading, setProjectLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const setProjectId = useCallback((id: string | null) => {
    setState((prev) => {
      const next = { projectId: id, project: id === prev.projectId ? prev.project : null };
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateProjectLocally = useCallback((updater: (prev: ProjectInfo | null) => ProjectInfo | null) => {
    setState((prev) => {
      const next = { ...prev, project: updater(prev.project) };
      saveToStorage(next);
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    setProjectLoading(true);
    setError(null);
    try {
      const data = await getProjectDetails(projectId);
      setState((prev) => {
        const next = { projectId: prev.projectId, project: data };
        saveToStorage(next);
        return next;
      });
    } catch (err) {
      setError(err);
    } finally {
      setProjectLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    if (!mounted.current && project && project.projectId === projectId) {
      mounted.current = true;
      return;
    }
    mounted.current = true;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const value = useMemo(
    () => ({ projectId, project, projectLoading, error, setProjectId, refresh, updateProjectLocally }),
    [projectId, project, projectLoading, error, setProjectId, refresh, updateProjectLocally],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
