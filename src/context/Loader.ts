import { createContext } from 'react';

export interface LoadingState {
  [key: string]: boolean;
}

interface LoaderContextType {
  loadingStates: LoadingState;
  setLoading: (id: string, isLoading: boolean) => void;
  isLoading: (id: string) => boolean;
}

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined);
