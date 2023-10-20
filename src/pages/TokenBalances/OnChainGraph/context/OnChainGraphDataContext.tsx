import { createContext, useCallback, useState } from 'react';
import { RecommendedUser } from '../types';
import {
  filterDuplicatedAndCalculateScore,
  getDefaultScoreMap,
  sortByScore
} from '../utils';

type OnChainGraphDataContextType = {
  data: RecommendedUser[];
  totalScannedDocuments: number;
  setTotalScannedDocuments: React.Dispatch<React.SetStateAction<number>>;
  setData: (cb: (data: RecommendedUser[]) => RecommendedUser[]) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const onChainGraphDataContext =
  createContext<OnChainGraphDataContextType | null>(null);

export function OnChainGraphDataContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [data, _setData] = useState<RecommendedUser[]>([]);
  const [totalScannedDocuments, setTotalScannedDocuments] = useState(0);

  const setData = useCallback(
    (cb: (data: RecommendedUser[]) => RecommendedUser[]) => {
      _setData(recommendations => {
        const updatedRecommendations = cb(recommendations);
        const score = getDefaultScoreMap();
        return sortByScore(
          filterDuplicatedAndCalculateScore(updatedRecommendations, score)
        );
      });
    },
    []
  );

  return (
    <onChainGraphDataContext.Provider
      value={{
        data,
        totalScannedDocuments,
        setData,
        setTotalScannedDocuments
      }}
    >
      {children}
    </onChainGraphDataContext.Provider>
  );
}
