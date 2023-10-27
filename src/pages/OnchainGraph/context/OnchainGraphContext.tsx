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
import { clearCache, getCache } from '../cache';

type OnchainGraphContextType = {
  data: RecommendedUser[];
  totalScannedDocuments: number;
  scanIncomplete: boolean;
  displayIdentities: {
    lensUsername: string;
    farcasterUsername: string;
    ens: string;
  };
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
  let lensUsername = '';
  let farcasterUsername = '';
  const user = data?.Wallet;

  if (!user) {
    return null;
  }

  user.socials?.forEach(social => {
    if (social.dappName === 'lens') {
      lensUsername = social.profileName;
    }
    if (social.dappName === 'farcaster') {
      farcasterUsername = social.profileName;
    }
  });

  let ens = user?.primaryDomain?.name || '';

  if (ens) {
    user.domains?.forEach(({ name, isPrimary }) => {
      if (isPrimary) {
        ens = name;
      }
      if (!ens) {
        ens = name;
      }
    });
  }
  return {
    lensUsername,
    farcasterUsername,
    ens
  };
}

export function OnchainGraphContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const identity = useIdentity();
  const _cache = getCache();

  // delete cache if identity has changed
  // do it outside of Effect to avoid the cache getting updated with the new identity from the children
  if (identity !== _cache.cacheFor) {
    clearCache();
  }

  const cache = useMemo(() => {
    return getCache();
  }, []);

  const recommendationsRef = useRef<RecommendedUser[]>(cache.data || []);
  const [displayIdentities, setDisplayIdentities] = useState({
    lensUsername: '',
    farcasterUsername: '',
    ens: ''
  });
  const [fetchData, { data: userSocial }] = useLazyQuery<SocialData>(
    SocialQuery,
    {},
    {
      onCompleted(data) {
        const identities = getIdentitiesFromSocial(data);
        if (!identities) {
          return;
        }
        setDisplayIdentities(identities);
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
      displayIdentities,
      totalScannedDocuments,
      setData,
      setScanIncomplete,
      sortDataUsingScore,
      setTotalScannedDocuments,
      reset
    };
  }, [
    data,
    displayIdentities,
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
