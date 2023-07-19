import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import {
  PoapOwnerQuery,
  TokenOwnerQuery,
  TokenTotalSupplyQuery
} from '../../../queries';
import { getDAppType } from '../utils';
import { HolderCount } from './HolderCount';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import { Poap, Token, TotalSupply } from '../Tokens/types';

const LIMIT = 200;

const imageAndSubTextMap: Record<
  string,
  {
    image?: string;
    subText: string;
  }
> = {
  totalOwners: {
    subText: 'own'
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

function Overview() {
  const [overViewData, setOverViewData] = useState({
    totalSupply: 0,
    totalOwners: 0,
    ownerWithENS: 0,
    ownerWithPrimaryENS: 0,
    ownerWithLens: 0,
    ownerWithFarcaster: 0
  });
  const holdersSetRef = useRef(new Set<string>());
  const overViewDataRef = useRef({
    totalSupply: 0,
    totalOwners: 0,
    ownerWithENS: 0,
    ownerWithPrimaryENS: 0,
    ownerWithLens: 0,
    ownerWithFarcaster: 0
  });

  const [
    fetchTokens,
    { data: tokensData, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(TokenOwnerQuery);

  const [fetchTotalSupply, { data: totalSupply, loading: loadingSupply }] =
    useLazyQueryWithPagination(TokenTotalSupplyQuery);

  const [
    fetchPoap,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(PoapOwnerQuery);

  const [tokenDetails, setTokenDetails] = useState<null | {
    name: string;
    tokenId: string;
    tokenAddress: string;
    image: string;
    tokenType: string;
  } | null>(null);

  const { address: tokenAddress, inputType, tokenType } = useSearchInput();

  const isPoap = inputType === 'POAP' || tokenType === 'POAP';

  useEffect(() => {
    if (tokenAddress) {
      if (isPoap) {
        fetchPoap({
          eventId: tokenAddress,
          limit: LIMIT
        });
        return;
      }

      fetchTokens({
        tokenAddress,
        limit: LIMIT
      });

      fetchTotalSupply({
        tokenAddress
      });
    }
  }, [fetchPoap, fetchTokens, fetchTotalSupply, isPoap, tokenAddress]);

  const updateCount = useCallback((tokenBalances: (Token | Poap)[]) => {
    let {
      // eslint-disable-next-line prefer-const
      totalSupply,
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

      owner?.socials?.forEach(social => {
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
      totalSupply,
      totalOwners,
      ownerWithENS,
      ownerWithPrimaryENS,
      ownerWithLens,
      ownerWithFarcaster
    };
  }, []);

  const { hasNextPage, getNextPage } = isPoap
    ? paginationPoaps
    : paginationTokens;

  const isERC20 = tokenType === 'ERC20' || tokenDetails?.tokenType === 'ERC20';

  useEffect(() => {
    if (tokensData && !isERC20) {
      const ethTokenBalances = tokensData?.ethereum?.TokenBalance || [];
      const polygonTokenBalances = tokensData?.polygon?.TokenBalance || [];

      const token = (ethTokenBalances[0] || polygonTokenBalances[0]) as Token;

      setTokenDetails(tokenDetails => {
        if (tokenDetails) return tokenDetails;

        return {
          name: token?.token?.name || '',
          tokenId: token?.tokenId || '',
          tokenAddress: token?.tokenAddress || '',
          image: '',
          tokenType: token?.tokenType
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
  }, [tokensData, getNextPage, hasNextPage, updateCount, isERC20]);

  useEffect(() => {
    if (totalSupply) {
      const supply = totalSupply as TotalSupply;
      let count = 0;

      if (supply?.ethereum?.totalSupply) {
        count += parseInt(supply.ethereum.totalSupply);
      }

      if (supply?.polygon?.totalSupply) {
        count += parseInt(supply.polygon.totalSupply);
      }

      overViewDataRef.current.totalSupply = count;

      setOverViewData(overViewData => ({
        ...overViewData,
        totalSupply: count
      }));
    }
  }, [totalSupply]);

  useEffect(() => {
    if (!poapsData) return;
    const poaps: Poap[] = poapsData.Poaps?.Poap || [];
    const poap = poaps[0] as Poap;

    setTokenDetails(tokenDetails => {
      if (tokenDetails) return tokenDetails;
      return {
        name: poap?.poapEvent?.eventName || '',
        tokenId: poap?.tokenId || '',
        tokenAddress: poap?.tokenAddress || '',
        image: poap?.poapEvent?.logo?.image?.medium || '',
        tokenType: 'POAP'
      };
    });
    updateCount(poaps);
    // load next page if available
    if (hasNextPage) {
      getNextPage();
    } else {
      setOverViewData(overViewDataRef.current);
    }
  }, [getNextPage, hasNextPage, poapsData, updateCount]);

  const tokenImage = useMemo(() => {
    if (!tokenDetails) return null;
    const { tokenId, tokenAddress, image } = tokenDetails;

    return (
      <Asset
        address={tokenAddress}
        tokenId={tokenId}
        preset="medium"
        image={image}
      />
    );
  }, [tokenDetails]);

  const loading = loadingPoaps || loadingTokens || hasNextPage;
  const totalHolders = overViewData?.totalOwners || 0;

  const holderCounts = useMemo(() => {
    return Object.keys(overViewData).map(key => {
      if (key === 'totalSupply') return null;
      const { image, subText: text } = imageAndSubTextMap[key];
      let subText = text;
      if (key === 'totalOwners' && tokenDetails) {
        subText += `${totalHolders <= 1 ? 's' : ''} ${
          tokenDetails.name || 'this contract'
        }`;
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
  }, [loading, overViewData, tokenDetails, tokenImage, totalHolders]);

  if (isERC20) return null;

  const lodingTotalSupply = isPoap ? false : loadingSupply;
  const supply = isPoap ? 0 : overViewData?.totalSupply;

  return (
    <div className="flex w-full bg-glass rounded-18 overflow-hidden h-auto sm:h-[421px]">
      <div className="border-solid-stroke bg-glass rounded-18 p-5 m-2.5 flex-1 w-full">
        <h3 className="text-2xl mb-2 flex items-center">
          Total supply{' '}
          {lodingTotalSupply ? (
            <div className="h-7 flex items-center ml-2">
              <Icon name="count-loader" className="h-2.5 w-auto" />
            </div>
          ) : (
            supply || '--'
          )}
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

export const HoldersOverview = memo(Overview);
