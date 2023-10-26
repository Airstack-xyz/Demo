import { useContext } from 'react';
import { onChainGraphContext } from '../context/OnchainGraphContext';

export function useOnChainGraphData() {
  const ctx = useContext(onChainGraphContext);
  if (!ctx) {
    throw new Error(
      'useOnChainGraphData must be used within OnChainGraphDataContextProvider'
    );
  }
  return ctx;
}
