import { createContext, useMemo, useState } from 'react';

type LoaderContext = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

// eslint-disable-next-line
const noop = () => {};

const defaultValue: LoaderContext = {
  isLoading: false,
  setIsLoading: noop
};

export const loaderContext = createContext<LoaderContext>(defaultValue);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading
    }),
    [isLoading]
  );
  return (
    <loaderContext.Provider value={value}>{children}</loaderContext.Provider>
  );
}
