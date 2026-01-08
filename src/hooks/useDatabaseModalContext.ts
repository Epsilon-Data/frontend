import { DatabaseModalContext } from '@app/context/DatabaseModal';
import { useContext } from 'react';

export const useDatabaseModalContext = () => {
  const context = useContext(DatabaseModalContext);

  if (!context) {
    throw new Error('useContext must be used within a DatabaseModalProvider');
  }
  return context;
};
