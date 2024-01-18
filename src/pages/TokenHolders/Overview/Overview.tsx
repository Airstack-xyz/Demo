import { Chain } from '@airstack/airstack-react/constants';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import { useGetAccountOwner } from '../../../hooks/useGetAccountOwner';
import { useGetHoldersCount } from '../../../hooks/useGetHoldersCount';
import { useGetTokens } from '../../../hooks/useGetTokens';
import { useGetTokensSupply } from '../../../hooks/useGetTokensSupply';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { TokenDetailsReset } from '../../../store/tokenDetails';
import {
  TokenHolder,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';
import { ERC6551TokenHolder } from '../ERC6551TokenHolder';
import { Details } from './Details';
import { HolderCount } from './HolderCount';
import { imageAndSubTextMap } from './imageAndSubTextMap';

function Overview({
  onAddress404,
  hideOverview
}: {
  onAddress404?: () => void;
  hideOverview?: boolean;
}) {
  const [{ address, activeView, activeTokenInfo }] = useSearchInput();

  const [fetchTokens, tokens, loadingTokens] = useGetTokens();
  const [fetchAccountsOwner, account, loadingAccount] = useGetAccountOwner(
    address[0]
  );

  const [, setTokens] = useOverviewTokens(['tokens']);

  const memoizedTokens = useMemo(() => tokens || [], [tokens]);

  const hasNoTokens = !loadingTokens && tokens && tokens.length === 0;

  const addressIsAccount =
    hasNoTokens && !loadingAccount && Boolean(account?.tokenAddress);

  const tokenWith6551 = useMemo(() => {
    if (!account) return null;
    const { tokenAddress, tokenId, blockchain } = account;
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId: ''
    };
  }, [account]);

  const shouldFetchHoldersCount = useMemo(() => {
    return memoizedTokens.every(token => token.tokenType !== 'ERC20');
  }, [memoizedTokens]);

  const hasEveryERC20 = useMemo(() => {
    return (
      memoizedTokens.length > 0 &&
      memoizedTokens.every(token => token.tokenType === 'ERC20')
    );
  }, [memoizedTokens]);

  useEffect(() => {
    if (hasNoTokens && onAddress404) {
      onAddress404();
    }
  }, [hasNoTokens, onAddress404, setTokens]);

  useEffect(() => {
    if (hasNoTokens) {
      fetchAccountsOwner();
    }
  }, [fetchAccountsOwner, hasNoTokens]);

  const {
    fetch: fetchHoldersCount,
    data: holdersCountData,
    loading: loadingHoldersCount,
    error: holdersCountError
  } = useGetHoldersCount();

  const [fetchTokensSupply, tokensSupply, loadingTokensSupply] =
    useGetTokensSupply();

  useEffect(() => {
    if (shouldFetchHoldersCount && memoizedTokens.length > 0 && !hideOverview) {
      const polygonTokens: string[] = [];
      const ethereumTokens: string[] = [];
      const baseTokens: string[] = [];
      const eventIds: string[] = [];

      memoizedTokens.forEach(({ eventId, blockchain, tokenAddress }) => {
        if (eventId) {
          eventIds.push(eventId);
          return;
        }
        switch (blockchain) {
          case 'ethereum':
            ethereumTokens.push(tokenAddress);
            break;
          case 'polygon':
            polygonTokens.push(tokenAddress);
            break;
          case 'base':
            baseTokens.push(tokenAddress);
            break;
        }
      });

      fetchHoldersCount({
        ethereumTokens,
        polygonTokens,
        baseTokens,
        eventIds
      });
    }
  }, [
    fetchHoldersCount,
    shouldFetchHoldersCount,
    memoizedTokens,
    hideOverview
  ]);

  useEffect(() => {
    if (memoizedTokens.length > 0) {
      setTokens({
        tokens: memoizedTokens.map(
          ({ name, tokenAddress, eventId, tokenType, blockchain }) => {
            const address = eventId ? eventId : tokenAddress;
            const tokenHolderItem: TokenHolder = {
              name,
              tokenAddress: address,
              holdersCount: tokensSupply?.[address.toLocaleLowerCase()] || 0,
              tokenType,
              blockchain
            };
            return tokenHolderItem;
          }
        )
      });
    }
  }, [memoizedTokens, setTokens, tokensSupply]);

  useEffect(() => {
    if (!address.length) return;
    fetchTokens(address);
    // Don't fetch token supply if for inner overview details or if overview is hidden
    if (!activeView && !hideOverview) {
      fetchTokensSupply(address);
    }
  }, [activeView, address, fetchTokens, fetchTokensSupply, hideOverview]);

  const overviewData = useMemo(() => {
    return {
      owners: holdersCountData?.totalHolders || 0,
      ens: holdersCountData?.ensUsersCount || 0,
      primaryEns: holdersCountData?.primaryEnsUsersCount || 0,
      lens: holdersCountData?.lensProfileCount || 0,
      farcaster: holdersCountData?.farcasterProfileCount || 0,
      xmtp:
        holdersCountData?.xmtpUsersCount === null
          ? '--'
          : holdersCountData?.xmtpUsersCount || 0
    };
  }, [holdersCountData]);

  const tokenImages = useMemo(() => {
    if (!memoizedTokens) return null;
    return memoizedTokens.map(token => {
      const { tokenId, tokenAddress, image, blockchain } = token;
      if (image)
        return (
          <div
            key={tokenId}
            className={classNames('flex-row-center', {
              flex: address.length === 1
            })}
          >
            <Asset
              address={tokenAddress}
              tokenId={tokenId}
              preset="medium"
              image={image}
              chain={blockchain as Chain}
              useImageOnError // Use image if there is an error loading the token image
              videoProps={{
                controls: false
              }}
              containerClassName="w-full [&>img]:w-full [&>video]:aspect-square [&>video]:object-cover"
            />
          </div>
        );
      return (
        <Asset
          address={tokenAddress}
          tokenId={tokenId}
          preset="medium"
          image={image}
          chain={blockchain as Chain}
          containerClassName="[&>img]:w-full [&>video]:aspect-square [&>video]:object-cover"
        />
      );
    });
  }, [address.length, memoizedTokens]);

  const totalHolders = (overviewData?.owners as number) || 0;
  const tokenName =
    memoizedTokens.length > 0
      ? `${memoizedTokens[0].name}${
          memoizedTokens[1] ? ` & ${memoizedTokens[1]?.name}` : ''
        }`
      : '';
  const noHoldersCount = !loadingTokens && !shouldFetchHoldersCount;
  const loadingCount = noHoldersCount
    ? false
    : loadingAccount ||
      loadingHoldersCount ||
      (loadingTokens && shouldFetchHoldersCount);

  const holderCounts = useMemo(() => {
    return Object.keys(overviewData).map(key => {
      if (key === 'totalSupply' || (noHoldersCount && key === 'owners')) {
        return null;
      }

      const { image, subText: text, name } = imageAndSubTextMap[key];
      let subText = text;
      if (key === 'owners' && memoizedTokens) {
        subText += `${totalHolders === 1 ? 's' : ''} ${
          memoizedTokens.length > 1
            ? 'both tokens'
            : tokenName || 'these tokens'
        }`;
      }

      let count = holdersCountError
        ? '--'
        : overviewData[key as keyof typeof overviewData];

      // hide count and subtext if there is no holders count
      if (noHoldersCount) {
        subText = '';
        count = '';
      }

      return (
        <HolderCount
          key={key}
          name={key}
          tokenName={tokenName || ''}
          loading={loadingCount}
          disableAction={loadingCount}
          count={count}
          subText={subText}
          withoutCount={noHoldersCount}
          sectionName={name}
          images={
            !image
              ? tokenImages || []
              : [<img src={image} alt="" className="w-full" />]
          }
        />
      );
    });
  }, [
    loadingCount,
    noHoldersCount,
    overviewData,
    memoizedTokens,
    tokenImages,
    tokenName,
    holdersCountError,
    totalHolders
  ]);

  const renderTokenNameAndSupply = useCallback(() => {
    return (
      <>
        {memoizedTokens.map(({ name, tokenAddress, eventId }, index) => {
          const address = eventId ? eventId : tokenAddress;
          const supply = tokensSupply?.[address.toLocaleLowerCase()];
          return (
            <span
              key={`${address}-${index}`}
              className={classNames('flex', {
                'max-w-[50%]': memoizedTokens.length > 1
              })}
            >
              <span className="ellipsis mr-1"> {name} </span>
              <span className="mx-1">: </span>
              <span className="w-[80px] ellipsis">{supply || '--'}</span>
              {index < memoizedTokens.length - 1 ? (
                <span className="mx-1">|</span>
              ) : null}
            </span>
          );
        })}
      </>
    );
  }, [memoizedTokens, tokensSupply]);

  if (activeTokenInfo) {
    return <Details />;
  }

  if (addressIsAccount && account?.tokenAddress) {
    return (
      <TokenDetailsReset>
        <ERC6551TokenHolder
          owner={account?.token?.owner?.identity}
          token={tokenWith6551 || account?.token}
        />
      </TokenDetailsReset>
    );
  }

  if (hasEveryERC20 || activeView || hideOverview) return null;

  // eslint-disable-next-line
  // @ts-ignore
  window.totalOwners = overviewData?.owners || 0;

  return (
    <div className="flex w-full bg-glass rounded-18 overflow-hidden h-auto sm:h-[421px] mb-7">
      <div className="border-solid-stroke bg-glass rounded-18 px-5 py-2.5 m-2.5 flex-1 w-full overflow-hidden">
        <div className="mb-2 flex flex-col">
          <div className="text-sm text-text-secondary">Total supply </div>
          <div className="ellipsis text-lg">
            {loadingTokensSupply ? (
              <div className="h-7 flex items-center ml-2">
                <Icon name="count-loader" className="h-2.5 w-auto" />
              </div>
            ) : (
              <div className="flex">{renderTokenNameAndSupply()}</div>
            )}
          </div>
        </div>
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
        className={classNames(
          'h-full flex-1 hidden [&>div]:h-full [&>div]:w-full sm:flex-col-center min-w-[421px] max-w-[421px] relative overflow-hidden',
          {
            'skeleton-loader': loadingTokens || loadingAccount
          }
        )}
        data-loader-type="block"
      >
        <div
          className={classNames(
            'flex [&>*]:w-1/2 justify-center items-center flex-wrap z-10 bg-glass',
            {
              '[&>div]:!h-full [&>div]:!w-full':
                tokenImages && tokenImages.length === 1
            }
          )}
        >
          {tokenImages}
        </div>
        {address.length > 1 && (
          <div className="flex [&>*]:w-1/2 justify-center items-center flex-wrap h-[150%] w-[150%] absolute">
            {tokenImages}
          </div>
        )}
      </div>
    </div>
  );
}

export const HoldersOverview = memo(Overview);
