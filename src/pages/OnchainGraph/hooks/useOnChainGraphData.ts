import { useContext } from 'react';
import { onChainGraphDataContext } from '../context/OnChainGraphDataContext';

export function useOnChainGraphData() {
  const ctx = useContext(onChainGraphDataContext);
  if (!ctx) {
    throw new Error(
      'useOnChainGraphData must be used within OnChainGraphDataContextProvider'
    );
  }
  return ctx;
}
