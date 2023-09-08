import { ReactNode, memo, useEffect } from 'react';
import { createStore } from 'react-nano-store';

export type Store = {
  hasERC6551: boolean;
  owner: string;
};

const store: Store = {
  hasERC6551: false,
  owner: ''
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTokenDetails = createStore(store);

export const TokenDetailsReset = memo(
  ({ children }: { children: ReactNode }) => {
    const setDetails = useTokenDetails(['hasERC6551', 'owner'])[1];
    useEffect(
      () => () => {
        setDetails({
          hasERC6551: false,
          owner: ''
        });
      },
      [setDetails]
    );
    return <>{children}</>;
  }
);
