import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { RecommendedUser } from '../types';
import { getDefaultScoreMap, worker } from '../utils';
import { useLazyQuery } from '@airstack/airstack-react';
import { SocialQuery } from '../../../queries';
import { useIdentity } from '../hooks/useIdentity';
import { ScoreMap } from '../constants';

type OnchainGraphContextType = {
  data: RecommendedUser[];
  totalScannedDocuments: number;
  scanIncomplete: boolean;
  setTotalScannedDocuments: React.Dispatch<React.SetStateAction<number>>;
  setData: (cb: (data: RecommendedUser[]) => RecommendedUser[]) => void;
  setScanIncomplete: React.Dispatch<React.SetStateAction<boolean>>;
  reset: () => void;
  sortDataUsingScore: (score: ScoreMap) => Promise<void>;
};

export interface SocialData {
  Wallet: {
    addresses: string[];
    primaryDomain: {
      name: string;
    };
    domains: {
      name: string;
    }[];
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const onChainGraphContext =
  createContext<OnchainGraphContextType | null>(null);

export function OnchainGraphContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const recommendationsRef = useRef<RecommendedUser[]>([]);
  const identity = useIdentity();
  const [fetchData, { data: userSocial }] =
    useLazyQuery<SocialData>(SocialQuery);
  const [data, _setData] = useState<RecommendedUser[]>([]);
  const userIdentitiesRef = useRef<string[]>([]);
  const [scanIncomplete, setScanIncomplete] = useState(false);

  useEffect(() => {
    if (identity.length > 0) {
      fetchData({
        identity
      });
    }
  }, [fetchData, identity]);

  useEffect(() => {
    const address = userSocial?.Wallet?.addresses || [];
    const domains = userSocial?.Wallet?.domains?.map(({ name }) => name) || [];
    userIdentitiesRef.current = [...address, ...domains];
  }, [userSocial?.Wallet?.addresses, userSocial?.Wallet?.domains]);

  const [totalScannedDocuments, setTotalScannedDocuments] = useState(0);

  const setData = useCallback(
    async (cb: (data: RecommendedUser[]) => RecommendedUser[]) => {
      const updatedRecommendations = cb(recommendationsRef.current);
      recommendationsRef.current = updatedRecommendations;
      const score = getDefaultScoreMap();
      const sortedData = await worker.sortFilterAndRankData(
        updatedRecommendations,
        score,
        userIdentitiesRef.current
      );
      _setData(sortedData);
    },
    []
  );

  const sortDataUsingScore = useCallback(async (score: ScoreMap) => {
    const sortedData = await worker.sortFilterAndRankData(
      recommendationsRef.current,
      score,
      userIdentitiesRef.current
    );
    _setData(sortedData);
  }, []);

  const reset = useCallback(() => {
    _setData([]);
    recommendationsRef.current = [];
    setTotalScannedDocuments(0);
    setScanIncomplete(false);
  }, []);

  const value = useMemo(() => {
    return {
      data,
      scanIncomplete,
      totalScannedDocuments,
      setData,
      setScanIncomplete,
      sortDataUsingScore,
      setTotalScannedDocuments,
      reset
    };
  }, [
    data,
    reset,
    scanIncomplete,
    setData,
    sortDataUsingScore,
    totalScannedDocuments
  ]);

  return (
    <onChainGraphContext.Provider value={value}>
      {children}
    </onChainGraphContext.Provider>
  );
}
