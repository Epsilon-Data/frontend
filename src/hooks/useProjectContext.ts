import { ProjectContext } from '@app/context/Project';
import { useContext } from 'react';

export const useProjectContext = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useContext must be used within a ProjectProvider');
  }
  return context;
};
