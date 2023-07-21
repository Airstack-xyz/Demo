import { useContext } from 'react';
import { searchContext } from '../context/search';

export const useSearchData = () => {
  const contextValue = useContext(searchContext);
  if (!contextValue) {
    throw new Error('useSearchData must be used within a SearchProvider');
  }
  return contextValue;
};
