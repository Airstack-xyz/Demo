import { useContext } from 'react';
import { loaderContext } from '../context/loader';

export const useLoaderContext = () => {
  const contextValue = useContext(loaderContext);
  if (!contextValue) {
    throw new Error('useLoaderContext must be used within a LoaderProvider');
  }
  return contextValue;
};
