import React from 'react';
import { ProjectSummaryInfo } from '@app/api/projects.api';
import { GridView } from './GridView';
import { ListView } from './ListView';

export const ProjectList: React.FC<{
  projects: ProjectSummaryInfo[];
  mode: 'dashboard' | 'all';
  layout: 'list' | 'grid';
  onProjectClick: (projectId: string) => void;
  onRetryCrawl?: (projectId: string) => void;
}> = ({ projects, mode, layout, onProjectClick, onRetryCrawl }) => {
  if (layout === 'list') {
    return <ListView projects={projects} mode={mode} onProjectClick={onProjectClick} onRetryCrawl={onRetryCrawl} />;
  }

  return <GridView projects={projects} mode={mode} onProjectClick={onProjectClick} onRetryCrawl={onRetryCrawl} />;
};
