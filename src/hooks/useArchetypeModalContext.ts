import { ArchetypeModalContext } from '@app/context/ArchetypeModal';
import { useContext } from 'react';

export const useArchetypeModalContext = () => {
  const context = useContext(ArchetypeModalContext);

  if (!context) {
    throw new Error('useContext must be used within a ArchetypeModalProvider');
  }
  return context;
};
