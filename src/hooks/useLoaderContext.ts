import { LoaderContext } from '@app/context/Loader';
import { useContext } from 'react';

export const useLoaderContext = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoaderContext must be used within LoaderProvider');
  }
  return context;
};
