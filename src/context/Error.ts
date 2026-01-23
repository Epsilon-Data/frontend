import { createContext, useContext } from 'react';
import { ApiErrorEvent } from '@app/api/http.api';

export type ErrorState = ApiErrorEvent | null;

type ErrorContextValue = {
  error: ErrorState;
  setError: (e: ErrorState) => void;
  clearError: () => void;
};

export const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useError must be used within ErrorProvider');
  return ctx;
};
