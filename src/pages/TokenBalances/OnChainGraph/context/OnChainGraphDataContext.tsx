import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { RecommendedUser } from '../types';
import {
  filterDuplicatedAndCalculateScore,
  getDefaultScoreMap,
  sortByScore
} from '../utils';
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
    (cb: (data: RecommendedUser[]) => RecommendedUser[]) => {
      _setData(recommendations => {
        const updatedRecommendations = cb(recommendations);
        const score = getDefaultScoreMap();
        return sortByScore(
          filterDuplicatedAndCalculateScore(
            updatedRecommendations,
            score,
            userIdentitiesRef.current
          )
        );
      });
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
