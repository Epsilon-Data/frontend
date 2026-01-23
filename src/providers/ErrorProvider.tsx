import { ErrorContext, ErrorState } from '@app/context/Error';
import { useCallback, useState } from 'react';

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<ErrorState>(null);

  const clearError = useCallback(() => setError(null), []);

  return <ErrorContext.Provider value={{ error, setError, clearError }}>{children}</ErrorContext.Provider>;
};
