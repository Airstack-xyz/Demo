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

type OnchainGraphContextType = {
  data: RecommendedUser[];
  totalScannedDocuments: number;
  setTotalScannedDocuments: React.Dispatch<React.SetStateAction<number>>;
  setData: (cb: (data: RecommendedUser[]) => RecommendedUser[]) => void;
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

  const value = useMemo(() => {
    return {
      data,
      totalScannedDocuments,
      setData,
      setTotalScannedDocuments
    };
  }, [data, setData, totalScannedDocuments]);

  return (
    <onChainGraphContext.Provider value={value}>
      {children}
    </onChainGraphContext.Provider>
  );
}
