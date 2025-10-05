import { BrowseModalContext } from '@app/context/BrowseModal';
import { useContext } from 'react';

export const useBrowseModalContext = () => {
  const context = useContext(BrowseModalContext);

  if (!context) {
    throw new Error('useContext must be used within a BrowseModalProvider');
  }
  return context;
};
