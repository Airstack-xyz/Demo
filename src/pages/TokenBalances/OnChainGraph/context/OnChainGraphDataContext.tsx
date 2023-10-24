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
import { useSearchInput } from '../../../../hooks/useSearchInput';
import { useLazyQuery } from '@airstack/airstack-react';
import { SocialQuery } from '../../../../queries';

type OnChainGraphDataContextType = {
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
export const onChainGraphDataContext =
  createContext<OnChainGraphDataContextType | null>(null);

export function OnChainGraphDataContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const recommendationsRef = useRef<RecommendedUser[]>([]);
  const [{ address }] = useSearchInput();
  const [fetchData, { data: userSocial }] =
    useLazyQuery<SocialData>(SocialQuery);
  const [data, _setData] = useState<RecommendedUser[]>([]);
  const userIdentitiesRef = useRef<string[]>([]);

  useEffect(() => {
    if (address.length > 0) {
      fetchData({
        identity: address[0]
      });
    }
  }, [fetchData, address]);

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
    <onChainGraphDataContext.Provider value={value}>
      {children}
    </onChainGraphDataContext.Provider>
  );
}
