import { LoaderContext, LoadingState } from '@app/context/Loader';
import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((id: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: isLoading,
    }));
  }, []);

  const isLoading = useCallback(
    (id: string) => {
      return loadingStates[id] ?? false;
    },
    [loadingStates],
  );

  return <LoaderContext.Provider value={{ loadingStates, setLoading, isLoading }}>{children}</LoaderContext.Provider>;
};

export const LoaderProviderKeyed: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { search } = useLocation();
  return <LoaderProvider key={search}>{children}</LoaderProvider>;
};
