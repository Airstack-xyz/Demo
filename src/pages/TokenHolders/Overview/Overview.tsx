import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { HolderCount } from './HolderCount';
import { Asset } from '../../../Components/Asset';
import { Icon } from '../../../Components/Icon';
import { OverviewBlockchainData, OverviewData } from '../types';
import { useGetTokenOverview } from '../../../hooks/useGetTokenOverview';
import { Chain } from '@airstack/airstack-react/constants';
import { imageAndSubTextMap } from './imageAndSubTextMap';
import { useFetchTokens } from '../../../hooks/useGetTokens';
import { useTokensSupply } from '../../../hooks/useTokensSupply';
import classNames from 'classnames';

function Overview() {
  const [overViewData, setOverViewData] = useState<
    Record<string, string | number>
  >({
    totalSupply: 0,
    owners: 0,
    ens: 0,
    primaryEns: 0,
    lens: 0,
    farcaster: 0,
    xmtp: 0
  });

  const [{ address, inputType, tokenType }] = useSearchInput();
  const tokenAddress = address.length > 0 ? address[0] : '';

  const isPoap = inputType === 'POAP' || tokenType === 'POAP';

  const {
    data: tokenOverviewData,
    loading: loadingTokenOverview,
    error: tokenOverviewError
  } = useGetTokenOverview(address, isPoap);

  const [fetchTokens, tokenDetails] = useFetchTokens();

  const [fetchTotalSupply, totalSupply, loadingSupply] = useTokensSupply();

  useEffect(() => {
    if (!address.length) return;
    fetchTokens(address, isPoap);
    fetchTotalSupply(address, isPoap);
  }, [address, fetchTokens, fetchTotalSupply, isPoap, tokenAddress]);

  const isERC20 = useMemo(() => {
    return (
      tokenType === 'ERC20' ||
      tokenDetails.some(token => token.tokenType === 'ERC20')
    );
  }, [tokenDetails, tokenType]);

  const updateOverviewData = useCallback((overview: OverviewBlockchainData) => {
    setOverViewData(_overview => {
      return {
        ..._overview,
        owners: overview?.totalHolders || 0,
        ens: overview?.ensUsersCount || 0,
        primaryEns: overview?.primaryEnsUsersCount || 0,
        lens: overview?.lensProfileCount || 0,
        farcaster: overview?.farcasterProfileCount || 0,
        xmtp:
          overview?.xmtpUsersCount === null
            ? '--'
            : overview?.xmtpUsersCount || 0
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

  const tokenImages = useMemo(() => {
    if (!tokenDetails) return null;
    return tokenDetails.map(token => {
      const { tokenId, tokenAddress, image, blockchain } = token;
      if (image)
        return (
          <div>
            <Asset
              address={tokenAddress}
              tokenId={tokenId}
              preset="medium"
              image={image}
              chain={blockchain as Chain}
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
        />
      );
    });
  }, [tokenDetails]);

  const loading = loadingTokenOverview;
  const totalHolders = (overViewData?.owners as number) || 0;
  const name = tokenDetails.length === 1 ? tokenDetails[0].name : '';

  const holderCounts = useMemo(() => {
    return Object.keys(overViewData).map(key => {
      if (key === 'totalSupply') return null;
      const { image, subText: text } = imageAndSubTextMap[key];
      let subText = text;
      if (key === 'owners' && tokenDetails) {
        subText += `${totalHolders <= 1 ? 's' : ''} ${
          name || 'these contract'
        }`;
      }

      const count = tokenOverviewError
        ? '--'
        : overViewData[key as keyof typeof overViewData];

      return (
        <HolderCount
          key={key}
          name={key}
          tokenName={name || ''}
          loading={loading}
          count={count}
          subText={subText}
          images={
            !image
              ? tokenImages || []
              : [<img src={image} alt="" className="w-full" />]
          }
        />
      );
    });
  }, [
    loading,
    name,
    overViewData,
    tokenDetails,
    tokenImages,
    tokenOverviewError,
    totalHolders
  ]);

  const getTokenNameAndSupply = useCallback(() => {
    return (
      <>
        {tokenDetails.map(({ name, tokenAddress }, index) => {
          return (
            <span>
              {name} {totalSupply?.[tokenAddress.toLocaleLowerCase()] || '--'}
              {index < tokenDetails.length - 1 ? (
                <span className="mx-1">|</span>
              ) : null}
            </span>
          );
        })}
      </>
    );
  }, [tokenDetails, totalSupply]);

  if (isERC20) return null;

  const lodingTotalSupply = loadingSupply || loadingTokenOverview;
  // eslint-disable-next-line
  // @ts-ignore
  window.totalOwners = overViewData?.owners || 0;

  return (
    <div className="flex w-full bg-glass rounded-18 overflow-hidden h-auto sm:h-[421px]">
      <div className="border-solid-stroke bg-glass rounded-18 p-5 m-2.5 flex-1 w-full overflow-hidden">
        <div className="mb-2 flex flex-col">
          <div className="text-sm text-text-secondary">Total supply </div>
          <div className="ellipsis text-lg">
            {lodingTotalSupply ? (
              <div className="h-7 flex items-center ml-2">
                <Icon name="count-loader" className="h-2.5 w-auto" />
              </div>
            ) : (
              <div>{getTokenNameAndSupply()}</div>
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
        className="h-full flex-1 hidden [&>div]:h-full [&>div]:w-full sm:flex-col-center min-w-[421px] max-w-[421px]"
        data-loader-type="block"
      >
        <div
          className={classNames(
            'flex [&>*]:w-1/2 justify-center items-center flex-wrap',
            {
              '[&>div]:!h-full [&>div]:!w-full':
                tokenImages && tokenImages.length === 1
            }
          )}
        >
          {tokenImages}
        </div>
      </div>
    </div>
  );
}

export const HoldersOverview = memo(Overview);
