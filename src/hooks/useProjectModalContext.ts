import { ProjectModalContext } from '@app/context/ProjectModal';
import { useContext } from 'react';

export const useProjectModalContext = () => {
  const context = useContext(ProjectModalContext);

  if (!context) {
    throw new Error('useContext must be used within a ProjectModalProvider');
  }
  return context;
};
