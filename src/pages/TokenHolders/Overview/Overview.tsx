import {
  useLazyQuery,
  useLazyQueryWithPagination
} from '@airstack/airstack-react';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import {
  PoapOwnerQuery,
  TokenOwnerQuery,
  TokenTotalSupplyQuery
} from '../../../queries';
import { HolderCount } from './HolderCount';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import {
  OverviewBlockchainData,
  OverviewData,
  Poap,
  Token,
  TotalSupply
} from '../Tokens/types';
import { useGetTokenOverview } from '../../../hooks/useGetTokenOverview';
import { Chain } from '@airstack/airstack-react/constants';

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

  const { address: tokenAddress, inputType, tokenType } = useSearchInput();

  const isPoap = inputType === 'POAP' || tokenType === 'POAP';

  const {
    data: tokenOverviewData,
    loading: loadingTokenOverview,
    error: tokenOverviewError
  } = useGetTokenOverview(tokenAddress, isPoap);

  const [fetchTokens, { data: tokensData }] = useLazyQuery(
    isPoap ? PoapOwnerQuery : TokenOwnerQuery
  );

  const [fetchTotalSupply, { data: totalSupply, loading: loadingSupply }] =
    useLazyQueryWithPagination(TokenTotalSupplyQuery);

  const [tokenDetails, setTokenDetails] = useState<null | {
    name: string;
    tokenId: string;
    tokenAddress: string;
    image: string;
    tokenType: string;
    blockchain: string;
  } | null>(null);

  useEffect(() => {
    if (!tokenAddress) return;

    const variables = isPoap ? { eventId: tokenAddress } : { tokenAddress };
    // just fetch one token to show the details
    fetchTokens({
      ...variables,
      limit: 1
    });

    if (!isPoap) {
      fetchTotalSupply({
        tokenAddress
      });
    }
  }, [fetchTokens, fetchTotalSupply, isPoap, tokenAddress]);

  const isERC20 = tokenType === 'ERC20' || tokenDetails?.tokenType === 'ERC20';

  const updateOverviewData = useCallback((overview: OverviewBlockchainData) => {
    setOverViewData(_overview => {
      return {
        ..._overview,
        totalOwners: overview?.totalHolders || 0,
        ownerWithENS: overview?.ensUsersCount || 0,
        ownerWithPrimaryENS: overview?.primaryEnsUsersCount || 0,
        ownerWithLens: overview?.lensProfileCount || 0,
        ownerWithFarcaster: overview?.farcasterProfileCount || 0
      };
    });
  }, []);

  useEffect(() => {
    if (isERC20 || !tokenOverviewData) return;

    const _overview = tokenOverviewData as OverviewData;

    if (_overview?.ethereum?.totalHolders) {
      updateOverviewData(_overview.ethereum);
    } else if (_overview?.polygon) {
      updateOverviewData(_overview?.polygon);
    }
  }, [tokenOverviewData, isERC20, updateOverviewData]);

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

      setOverViewData(overViewData => ({
        ...overViewData,
        totalSupply: count
      }));
    }
  }, [totalSupply]);

  useEffect(() => {
    if (isPoap || !tokensData || isERC20) return;

    const ethTokenBalances = tokensData?.ethereum?.TokenBalance || [];
    const polygonTokenBalances = tokensData?.polygon?.TokenBalance || [];

    const token = (ethTokenBalances[0] || polygonTokenBalances[0]) as Token;

    setTokenDetails(tokenDetails => {
      if (tokenDetails) return tokenDetails;

      return {
        name: token?.token?.name || '',
        tokenId: token?.tokenId || '',
        tokenAddress: token?.tokenAddress || '',
        image:
          token?.token?.logo?.medium ||
          token?.token?.projectDetails?.imageUrl ||
          '',
        tokenType: token?.tokenType,
        blockchain: token?.blockchain
      };
    });
  }, [tokensData, isERC20, isPoap]);

  useEffect(() => {
    if (!isPoap || !tokensData) return;
    const poaps: Poap[] = tokensData?.Poaps?.Poap || [];
    const poap = poaps[0] as Poap;
    if (!poap) return;

    setTokenDetails(tokenDetails => {
      if (tokenDetails) return tokenDetails;
      return {
        name: poap?.poapEvent?.eventName || '',
        tokenId: poap?.tokenId || '',
        tokenAddress: poap?.tokenAddress || '',
        image: poap?.poapEvent?.logo?.image?.medium || '',
        tokenType: 'POAP',
        blockchain: 'ethereum'
      };
    });
  }, [isPoap, tokensData]);

  const tokenImage = useMemo(() => {
    if (!tokenDetails) return null;

    const { tokenId, tokenAddress, image, blockchain } = tokenDetails;

    return (
      <Asset
        address={tokenAddress}
        tokenId={tokenId}
        preset="medium"
        image={image}
        chain={blockchain as Chain}
      />
    );
  }, [tokenDetails]);

  const loading = loadingTokenOverview;
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
          count={
            tokenOverviewError
              ? '--'
              : overViewData[key as keyof typeof overViewData]
          }
          subText={subText}
          image={
            !image ? tokenImage : <img src={image} alt="" className="w-full" />
          }
        />
      );
    });
  }, [
    loading,
    overViewData,
    tokenDetails,
    tokenImage,
    tokenOverviewError,
    totalHolders
  ]);

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
        className="h-full flex-1 hidden [&>div]:h-full [&>div]:w-full [&>div>img]:w-full [&>div>img]:min-w-full sm:flex-col-center max-w-[421px]"
        data-loader-type="block"
      >
        {tokenImage}
      </div>
    </div>
  );
}

export const HoldersOverview = memo(Overview);
