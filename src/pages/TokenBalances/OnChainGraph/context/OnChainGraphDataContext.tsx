import { createContext, useState } from 'react';
import { RecommendedUser } from '../types';

type OnChainGraphDataContextType = {
  data: RecommendedUser[];
  totalScannedDocuments: number;
  setTotalScannedDocuments: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<React.SetStateAction<RecommendedUser[]>>;
};

export const onChainGraphDataContext =
  createContext<OnChainGraphDataContextType | null>(null);

export function OnChainGraphDataContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<RecommendedUser[]>([]);
  const [totalScannedDocuments, setTotalScannedDocuments] = useState(0);

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
