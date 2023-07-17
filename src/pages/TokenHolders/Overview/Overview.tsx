import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { tokenOwnerQuery } from '../../../queries';
import { TokenBalance, Social } from '../../TokenBalances/types';
import { getDAppType } from '../utils';
import { HolderCount } from './HolderCount';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';

const LIMIT = 200;

const imageAndSubTextMap: Record<
  string,
  {
    image?: string;
    subText: string;
  }
> = {
  totalOwners: {
    subText: 'owns'
  },
  ownerWithLens: {
    image: '/images/lens.svg',
    subText: 'have Lens profiles'
  },
  ownerWithFarcaster: {
    image: '/images/farcaster.svg',
    subText: 'have Farcaster profiles'
  },
  ownerWithENS: {
    image: '/images/ens.svg',
    subText: 'have ENS names'
  },
  ownerWithPrimaryENS: {
    image: '/images/ens.svg',
    subText: 'have Primary ENS'
  }
};

export function HoldersOverview() {
  const [showOverview, setShowOverview] = useState(false);
  const [overViewData, setOverViewData] = useState({
    totalOwners: 0,
    ownerWithENS: 0,
    ownerWithPrimaryENS: 0,
    ownerWithLens: 0,
    ownerWithFarcaster: 0
  });
  const holdersSetRef = useRef(new Set<string>());
  const overViewDataRef = useRef({
    totalOwners: 0,
    ownerWithENS: 0,
    ownerWithPrimaryENS: 0,
    ownerWithLens: 0,
    ownerWithFarcaster: 0
  });
  const [fetch, { data, loading: loadingTokens, pagination }] =
    useLazyQueryWithPagination(tokenOwnerQuery);
  const [tokenDetails, setTokenDetails] = useState<null | {
    name: string;
    tokenId: string;
    tokenAddress: string;
  } | null>(null);

  const { address: tokenAddress } = useSearchInput();

  useEffect(() => {
    if (tokenAddress) {
      fetch({
        tokenAddress,
        limit: LIMIT
      });
    }
  }, [fetch, tokenAddress]);

  const updateCount = useCallback((tokenBalances: TokenBalance[]) => {
    let {
      totalOwners,
      ownerWithENS,
      ownerWithPrimaryENS,
      ownerWithLens,
      ownerWithFarcaster
    } = overViewDataRef.current;

    tokenBalances.forEach(({ owner }) => {
      if (!holdersSetRef.current.has(owner.identity)) {
        totalOwners++;
      } else {
        return;
      }

      holdersSetRef.current.add(owner.identity);

      if (owner.primaryDomain) {
        ownerWithPrimaryENS++;
      }
      if (owner.domains && owner.domains.length > 0) {
        ownerWithENS++;
      }
      owner?.socials?.forEach((social: Social) => {
        const type = getDAppType(social.dappSlug);
        if (type === 'lens') {
          ownerWithLens++;
        }
        if (type === 'farcaster') {
          ownerWithFarcaster++;
        }
      });
    });

    overViewDataRef.current = {
      totalOwners,
      ownerWithENS,
      ownerWithPrimaryENS,
      ownerWithLens,
      ownerWithFarcaster
    };
  }, []);

  const { hasNextPage, getNextPage } = pagination;

  useEffect(() => {
    if (data) {
      const ethTokenBalances: TokenBalance[] =
        data?.ethereum?.TokenBalance || [];
      const polygonTokenBalances: TokenBalance[] =
        data?.polygon?.TokenBalance || [];

      setTokenDetails(tokenDetails => {
        if (tokenDetails) return tokenDetails;
        return {
          name: ethTokenBalances[0]?.token?.name || '',
          tokenId: ethTokenBalances[0]?.tokenId || '',
          tokenAddress: ethTokenBalances[0]?.tokenAddress || ''
        };
      });

      updateCount(ethTokenBalances);
      updateCount(polygonTokenBalances);
      // load next page if available
      if (hasNextPage) {
        getNextPage();
      } else {
        setOverViewData(overViewDataRef.current);
      }
    }
  }, [data, getNextPage, hasNextPage, updateCount]);

  const tokenImage = useMemo(() => {
    if (!tokenDetails) return null;
    const { tokenId, tokenAddress } = tokenDetails;
    return <Asset address={tokenAddress} tokenId={tokenId} preset="medium" />;
  }, [tokenDetails]);

  const loading = loadingTokens || hasNextPage;
  const holderCounts = useMemo(() => {
    return Object.keys(overViewData).map(key => {
      const { image, subText: text } = imageAndSubTextMap[key];
      let subText = text;
      if (key === 'totalOwners' && tokenDetails) {
        subText += ` ${tokenDetails.name}`;
      }
      return (
        <HolderCount
          key={key}
          loading={loading}
          count={overViewData[key as keyof typeof overViewData]}
          subText={subText}
          image={
            !image ? tokenImage : <img src={image} alt="" className="w-full" />
          }
        />
      );
    });
  }, [loading, overViewData, tokenDetails, tokenImage]);

  if (!showOverview) {
    return (
      <div
        onClick={() => setShowOverview(true)}
        className="flex items-center w-full bg-glass rounded-18 border-solid-stroke overflow-hidden py-4 pl-10 cursor-pointer text-xs font-bold"
      >
        Fetch aggregated stats
        <Icon name="arrow-right-round" className="ml-2.5 w-[19px]" />
      </div>
    );
  }

  const totalHolders = overViewData?.totalOwners || 0;

  return (
    <div className="flex w-full bg-glass rounded-18 overflow-hidden h-auto sm:h-[421px]">
      <div className="border-solid-stroke bg-glass rounded-18 p-5 m-2.5 flex-1 w-full">
        <h3 className="text-2xl mb-2 flex ">
          {loading ? (
            <div className="h-7 flex items-center mr-2">
              <Icon name="count-loader" className="h-2.5 w-auto" />
            </div>
          ) : (
            totalHolders
          )}{' '}
          Holders
        </h3>
        <div className="h-[5px] flex rounded-full overflow-hidden">
          <div className="h-full bg-[#6527A3] w-[55%]"></div>
          <div className="h-full bg-[#5398FF] w-[20%]"></div>
          <div className="h-full bg-[#5398FF] w-[10%]"></div>
          <div className="h-full bg-[#224F24] w-[10%]"></div>
          <div className="h-full bg-[#835EC7] w-[5%]"></div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mt-5">{holderCounts}</div>
      </div>
      <div
        className="h-full flex-1 hidden sm:block [&>div]:h-full [&>div]:w-full [&>div>img]:w-full"
        data-loader-type="block"
      >
        {tokenImage}
      </div>
    </div>
  );
}
