import { ArchetypeFlowContext } from '@app/context/ArchetypeFlow';
import { useContext } from 'react';

export const useArchetypeFlowContext = () => {
  const context = useContext(ArchetypeFlowContext);

  if (!context) {
    throw new Error('useContext must be used within a ArchetypFlowProvider');
  }
  return context;
};
