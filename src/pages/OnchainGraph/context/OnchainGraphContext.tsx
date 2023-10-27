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
import { getCache } from '../cache';

type OnchainGraphContextType = {
  data: RecommendedUser[];
  totalScannedDocuments: number;
  scanIncomplete: boolean;
  displayIdentity: string;
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
      isPrimary: string;
    }[];
    socials?: {
      isDefault: boolean;
      dappName: string;
      dappSlug: string;
      blockchain: string;
      profileName: string;
      profileTokenId: string;
      followerCount: number;
      followingCount: number;
    }[];
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export const onChainGraphContext =
  createContext<OnchainGraphContextType | null>(null);

function getIdentitiesFromSocial(data: SocialData) {
  let lensUserName = '';
  let farcasterUserName = '';
  const user = data?.Wallet;

  if (!user) {
    return null;
  }

  user.socials?.forEach(social => {
    if (social.dappName === 'lens') {
      lensUserName = social.profileName;
    }
    if (social.dappName === 'farcaster') {
      farcasterUserName = social.profileName;
    }
  });

  let domain = user?.primaryDomain?.name || '';

  if (domain) {
    user.domains?.forEach(({ name, isPrimary }) => {
      if (isPrimary) {
        domain = name;
      }
      if (!domain) {
        domain = name;
      }
    });
  }
  return { lensUserName, farcasterUserName, domain };
}

export function OnchainGraphContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const cache = useMemo(() => {
    return getCache();
  }, []);

  const recommendationsRef = useRef<RecommendedUser[]>([]);
  const identity = useIdentity();
  const [displayIdentity, setDisplayIdentity] = useState(identity);
  const [fetchData, { data: userSocial }] = useLazyQuery<SocialData>(
    SocialQuery,
    {},
    {
      onCompleted(data) {
        const identities = getIdentitiesFromSocial(data);
        if (!identities) {
          return;
        }

        const { domain, lensUserName, farcasterUserName } = identities;
        setDisplayIdentity(
          domain || lensUserName || farcasterUserName || identity
        );
      }
    }
  );

  const _scanIncomplete =
    (cache.data || []).length > 0 && !cache.hasCompleteData;

  const [data, _setData] = useState<RecommendedUser[]>(cache.data || []);
  const userIdentitiesRef = useRef<string[]>([]);
  const [scanIncomplete, setScanIncomplete] = useState(_scanIncomplete);

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

  const [totalScannedDocuments, setTotalScannedDocuments] = useState(
    cache.totalScannedDocuments || 0
  );

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
      displayIdentity,
      totalScannedDocuments,
      setData,
      setScanIncomplete,
      sortDataUsingScore,
      setTotalScannedDocuments,
      reset
    };
  }, [
    data,
    displayIdentity,
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
