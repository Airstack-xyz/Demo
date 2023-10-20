import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react';
import { RecommendedUser } from '../types';

type OnChainGraphDataContextType = {
  data: RecommendedUser[];
  setData: (cb: (data: RecommendedUser[]) => RecommendedUser[]) => void;
};

export const onChainGraphDataContext =
  createContext<OnChainGraphDataContextType | null>(null);

export function OnChainGraphDataContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  //   const dataRef = useRef<RecommendedUser[]>([]);
  const [data, _setData] = useState<RecommendedUser[]>([]);

  const setData = useCallback(
    (cb: (data: RecommendedUser[]) => RecommendedUser[]) => {
      _setData(cb);
    },
    []
  );

  return (
    <onChainGraphDataContext.Provider
      value={{
        data,
        setData
      }}
    >
      {children}
    </onChainGraphDataContext.Provider>
  );
}
