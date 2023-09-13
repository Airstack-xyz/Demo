import { useEffect, useCallback, useMemo, memo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { HolderCount } from './HolderCount';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import { useGetTokenOverview } from '../../../hooks/useGetTokenOverview';
import { Chain } from '@airstack/airstack-react/constants';
import { imageAndSubTextMap } from './imageAndSubTextMap';
import { useFetchTokens } from '../../../hooks/useGetTokens';
import { useTokensSupply } from '../../../hooks/useTokensSupply';
import classNames from 'classnames';
import {
  TokenHolder,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';
import { showToast } from '../../../utils/showToast';
import { useGetAccountOwner } from '../../../hooks/useGetAccountOwner';
import { ERC6551TokenHolder } from '../ERC6551TokenHolder';
import { Details } from './Details';
import { TokenDetailsReset } from '../../../store/tokenDetails';

function Overview({ onAddress404 }: { onAddress404?: () => void }) {
  const [{ address, activeView, activeTokenInfo }] = useSearchInput();

  const isPoap = address.every(token => !token.startsWith('0x'));

  const [fetchTokens, tokens, loadingTokens] = useFetchTokens();
  const [fetchAccountsOwner, account, loadingAccount] = useGetAccountOwner(
    address[0]
  );

  const setTokens = useOverviewTokens(['tokens'])[1];

  const tokenDetails = useMemo(() => tokens || [], [tokens]);
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

  const shouldFetchHoldersCount = useMemo(() => {
    return tokenDetails.every(token => {
      return token.tokenType !== 'ERC20';
    });
  }, [tokenDetails]);

  const {
    fetch: fetchTokenOverview,
    data: tokenOverviewData,
    loading: loadingTokenOverview,
    error: tokenOverviewError
  } = useGetTokenOverview();

  const [fetchTotalSupply, totalSupply, loadingSupply] = useTokensSupply();

  useEffect(() => {
    if (shouldFetchHoldersCount && tokenDetails.length > 0) {
      const polygonTokens: string[] = [];
      const ethereumTokens: string[] = [];
      const eventIds: string[] = [];

      tokenDetails.forEach(token => {
        if (token.eventId) {
          eventIds.push(token.eventId);
          return;
        }
        if (token.blockchain === 'polygon') {
          polygonTokens.push(token.tokenAddress);
        } else {
          ethereumTokens.push(token.tokenAddress);
        }
      });

      fetchTokenOverview({
        ethereumTokens,
        polygonTokens,
        eventIds
      });
    }
  }, [
    fetchTokenOverview,
    address,
    shouldFetchHoldersCount,
    isPoap,
    tokenDetails.length,
    tokenDetails
  ]);

  const hasMulitpleERC20 = useMemo(() => {
    const erc20Tokens = tokenDetails.filter(
      token => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [tokenDetails]);

  useEffect(() => {
    if (hasMulitpleERC20) {
      showToast('Try to combine ERC20 tokens with NFTs or POAPs', 'negative');
    }
  }, [hasMulitpleERC20]);

  const isERC20 = useMemo(() => {
    return (
      tokenDetails.length > 0 &&
      tokenDetails.every(token => token.tokenType === 'ERC20')
    );
  }, [tokenDetails]);

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setTokens({
        tokens: tokenDetails.map(
          ({ name, tokenAddress, eventId, tokenType, blockchain }) => {
            const key = eventId ? eventId : tokenAddress;
            const tokenAndHolders: TokenHolder = {
              name,
              tokenAddress: key,
              holdersCount: totalSupply?.[key.toLocaleLowerCase()] || 0,
              tokenType,
              blockchain
            };
            return tokenAndHolders;
          }
        )
      });
    }
  }, [tokenDetails, setTokens, totalSupply]);

  useEffect(() => {
    if (!address.length) return;
    fetchTokens(address);
    if (!activeView) {
      fetchTotalSupply(address);
    }
  }, [activeView, address, fetchTokens, fetchTotalSupply, isPoap]);

  const overViewData = useMemo(() => {
    return {
      owners: tokenOverviewData?.totalHolders || 0,
      ens: tokenOverviewData?.ensUsersCount || 0,
      primaryEns: tokenOverviewData?.primaryEnsUsersCount || 0,
      lens: tokenOverviewData?.lensProfileCount || 0,
      farcaster: tokenOverviewData?.farcasterProfileCount || 0,
      xmtp:
        tokenOverviewData?.xmtpUsersCount === null
          ? '--'
          : tokenOverviewData?.xmtpUsersCount || 0
    };
  }, [tokenOverviewData]);

  const tokenImages = useMemo(() => {
    if (!tokenDetails) return null;
    return tokenDetails.map(token => {
      const { tokenId, tokenAddress, image, blockchain } = token;
      if (image)
        return (
          <div
            className={classNames({
              flex: address.length === 1
            })}
          >
            <Asset
              address={tokenAddress}
              tokenId={tokenId}
              preset="medium"
              image={image}
              chain={blockchain as Chain}
              useImageOnError // use image if there is an error loading the token image
              videoProps={{
                controls: false
              }}
              containerClassName="w-full [&>img]:w-full"
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
          containerClassName="[&>img]:w-full"
        />
      );
    });
  }, [address.length, tokenDetails]);

  const totalHolders = (overViewData?.owners as number) || 0;
  const tokenName =
    tokenDetails.length > 0
      ? `${tokenDetails[0].name}${
          tokenDetails[1] ? ` & ${tokenDetails[1]?.name}` : ''
        }`
      : '';
  const noHoldersCount = !loadingTokens && !shouldFetchHoldersCount;
  const loadingCount = noHoldersCount
    ? false
    : loadingAccount ||
      loadingTokenOverview ||
      (loadingTokens && shouldFetchHoldersCount);

  const holderCounts = useMemo(() => {
    return Object.keys(overViewData).map(key => {
      if (key === 'totalSupply' || (noHoldersCount && key === 'owners')) {
        return null;
      }

      const { image, subText: text, name } = imageAndSubTextMap[key];
      let subText = text;
      if (key === 'owners' && tokenDetails) {
        subText += `${totalHolders === 1 ? 's' : ''} ${
          tokenDetails.length > 1 ? 'both tokens' : tokenName || 'these tokens'
        }`;
      }

      let count = tokenOverviewError
        ? '--'
        : overViewData[key as keyof typeof overViewData];

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
    overViewData,
    tokenDetails,
    tokenImages,
    tokenName,
    tokenOverviewError,
    totalHolders
  ]);

  const getTokenNameAndSupply = useCallback(() => {
    return (
      <>
        {tokenDetails.map(({ name, tokenAddress, eventId }, index) => {
          const key = eventId ? eventId : tokenAddress;
          const supply = totalSupply?.[key.toLocaleLowerCase()];
          return (
            <span
              className={classNames('flex', {
                'max-w-[50%]': tokenDetails.length > 1
              })}
            >
              <span className="ellipsis mr-1"> {name} </span>
              <span className="mx-1">: </span>
              <span className="w-[80px] ellipsis">{supply || '--'}</span>
              {index < tokenDetails.length - 1 ? (
                <span className="mx-1">|</span>
              ) : null}
            </span>
          );
        })}
      </>
    );
  }, [tokenDetails, totalSupply]);

  if (activeTokenInfo) {
    return <Details />;
  }

  if (addressIsAccount && account?.tokenAddress) {
    return (
      <TokenDetailsReset>
        <ERC6551TokenHolder
          owner={account?.token?.owner?.identity}
          token={tokenWith6551 || account?.token || null}
        />
      </TokenDetailsReset>
    );
  }

  if (isERC20 || activeView) return null;

  // eslint-disable-next-line
  // @ts-ignore
  window.totalOwners = overViewData?.owners || 0;

  return (
    <div className="flex w-full bg-glass rounded-18 overflow-hidden h-auto sm:h-[421px] mb-7">
      <div className="border-solid-stroke bg-glass rounded-18 px-5 py-2.5 m-2.5 flex-1 w-full overflow-hidden">
        <div className="mb-2 flex flex-col">
          <div className="text-sm text-text-secondary">Total supply </div>
          <div className="ellipsis text-lg">
            {loadingSupply ? (
              <div className="h-7 flex items-center ml-2">
                <Icon name="count-loader" className="h-2.5 w-auto" />
              </div>
            ) : (
              <div className="flex">{getTokenNameAndSupply()}</div>
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
