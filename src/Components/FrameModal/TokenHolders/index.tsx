import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TokenHolder,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';
import {
  GetPoapHoldersQuery,
  GetTokenHoldersQuery
} from '../../../queries/frames/tokenHoldersQuery';
import {
  Poap,
  TokenBalance,
  TokenHoldersFrameResponse,
  TokenHoldersFrameVariables
} from './types';
import { useLazyQuery } from '@airstack/airstack-react';
import {
  ENCODED_BLOCKCHAIN,
  ENCODED_TOKEN_TYPE,
  FRAMES_ENDPOINT,
  PLACEHOLDER_URL
} from '../constants';
import { encodeFrameData } from '../utils';
import { EmptyIcon, FrameIconBlue } from '../Icons';
import { Tooltip, tooltipClass } from '../../Tooltip';
import { Modal } from '../../Modal';
import { FramePreview } from '../FramePreview';
import { FrameURL } from '../FrameURL';
import { FrameLabel } from '../FrameLabel';
import { ToggleSwitch } from '../../ToggleSwitch';
import {
  getFrameButtons,
  getResolvedHolderImage,
  getResolvedHolderData
} from './utils';
import LazyImage from '../../LazyImage';

const iconMap: Record<string, string> = {
  lens: '/images/lens.svg',
  farcaster: '/images/farcaster.svg',
  ens: '/images/ens.svg'
};

function Token({
  item,
  isTokenImagePrimary
}: {
  item: Poap | TokenBalance;
  isTokenImagePrimary: boolean;
}) {
  const tokenBalance = item as TokenBalance;
  const poap = item as Poap;

  const isPoap = Boolean(poap?.poapEvent);

  const poapEvent = poap?.poapEvent || {};

  const tokenImage =
    (isPoap
      ? poapEvent?.contentValue?.image?.small
      : tokenBalance?.tokenNfts?.contentValue?.image?.small ||
        tokenBalance?.token?.logo?.small ||
        tokenBalance?.token?.projectDetails?.imageUrl) || PLACEHOLDER_URL;

  const tokenHolder = getResolvedHolderData(item.owner);

  const profileImage = getResolvedHolderImage(item.owner) || PLACEHOLDER_URL;

  const assetImage = isTokenImagePrimary ? tokenImage : profileImage;

  const assetIcon1 = isTokenImagePrimary
    ? profileImage
    : tokenHolder?.type
    ? iconMap[tokenHolder.type]
    : PLACEHOLDER_URL;

  const assetIcon2 = isTokenImagePrimary ? undefined : tokenImage;

  const assetId = isPoap ? `#${poapEvent.eventId}` : `#${tokenBalance.tokenId}`;

  return (
    <div className="w-[calc(50%-26px)] aspect-square rounded-[18px] bg-secondary flex flex-col text-left justify-end overflow-hidden relative border border-solid border-white">
      <div className="absolute inset-0 flex-col-center">
        <LazyImage
          alt="AssetImage"
          src={assetImage}
          fallbackSrc={PLACEHOLDER_URL}
          className="w-full"
        />
      </div>
      <div className="z-10 max-sm:h-[50px] h-[70px] max-sm:p-1.5 p-2.5 flex flex-col justify-end bg-gradient-to-b from-[#00000000] to-[#1B121C]">
        <div className="flex items-center gap-1 text-sm font-bold">
          {!!assetIcon1 && (
            <img
              alt="AssetIcon1"
              src={assetIcon1}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="ellipsis max-sm:max-w-[90px] max-w-[250px]">
            {tokenHolder?.name}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-sm min-h-[24px]">
          {!!assetIcon2 && (
            <img
              alt="AssetIcon2"
              src={assetIcon2}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="ellipsis max-sm:max-w-[90px] max-w-[250px]">
            {assetId}
          </span>
          <span className="text-text-secondary">(token held)</span>
        </div>
      </div>
    </div>
  );
}

function ModalContent() {
  const [{ tokens: _overviewTokens }] = useOverviewTokens(['tokens']);

  const [isTokenImagePrimary, setIsTokenPrimaryImage] = useState(false);

  const isOverviewTokensLoading = _overviewTokens?.length === 0;

  const overviewToken: TokenHolder = _overviewTokens?.[0];

  const isPoap = overviewToken?.tokenType === 'POAP';

  const query = isPoap ? GetPoapHoldersQuery : GetTokenHoldersQuery;

  const [fetch, { loading, error, data }] = useLazyQuery<
    TokenHoldersFrameResponse,
    TokenHoldersFrameVariables
  >(query);

  const fetchData = useCallback(() => {
    if (!overviewToken) {
      return;
    }
    fetch({
      address: overviewToken.tokenAddress,
      blockchain: overviewToken.blockchain,
      limit: 2
    });
  }, [fetch, overviewToken]);

  const handleTokenPrimaryImageToggle = useCallback(() => {
    setIsTokenPrimaryImage(prevValue => !prevValue);
  }, []);

  useEffect(() => {
    if (overviewToken) {
      fetchData();
    }
  }, [fetchData, overviewToken]);

  const items = isPoap ? data?.Poaps?.Poap : data?.TokenBalances?.TokenBalance;

  const frameUrl = useMemo(() => {
    if (!overviewToken) {
      return '';
    }
    const frameData = encodeFrameData({
      n: overviewToken.name,
      t: ENCODED_TOKEN_TYPE[
        overviewToken.tokenType as keyof typeof ENCODED_TOKEN_TYPE
      ],
      a: overviewToken.tokenAddress,
      b: ENCODED_BLOCKCHAIN[
        overviewToken.blockchain as keyof typeof ENCODED_BLOCKCHAIN
      ],
      p: isTokenImagePrimary ? '1' : '0'
    });
    return `${FRAMES_ENDPOINT}/th/${frameData}`;
  }, [isTokenImagePrimary, overviewToken]);

  const frameButtons = useMemo(() => {
    if (!overviewToken) {
      return [];
    }
    return getFrameButtons(items);
  }, [items, overviewToken]);

  const handleRetry = () => {
    fetchData();
  };

  const renderFrameContent = () => {
    if (loading || isOverviewTokensLoading) {
      return (
        <div className="my-auto flex-col-center gap-1 font-concert-one max-sm:text-base text-xl text-center">
          <img alt="Logo" src="/logo-white.svg" height={32} width={32} />
          Generating preview...
        </div>
      );
    }

    if (error) {
      return (
        <div className="my-auto flex-col-center gap-1 font-concert-one max-sm:text-base text-xl text-center">
          Something went wrong!
          <button
            type="button"
            className="hover:opacity-60"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      );
    }

    const tokenName =
      (isPoap
        ? data?.Poaps?.Poap?.[0]?.poapEvent?.eventName
        : data?.TokenBalances?.TokenBalance?.[0]?.token?.name) || '';

    return (
      <div className="flex flex-col items-center w-full h-full">
        <div className="font-concert-one max-sm:text-sm text-xl text-center max-sm:mt-2 mt-3.5 flex gap-2">
          All holders of
          <span className="ellipsis max-sm:max-w-[90px] max-w-[250px]">
            {tokenName}
          </span>
        </div>
        <div className="flex flex-wrap justify-center max-sm:gap-[25px] gap-[50px] h-full w-full max-sm:py-4 max-sm:px-8 py-6 px-16">
          {items?.length ? (
            items.map((item, index) => (
              <Token
                key={index}
                item={item}
                isTokenImagePrimary={isTokenImagePrimary}
              />
            ))
          ) : (
            <div className="flex-col-center font-concert-one text-xl text-center">
              <EmptyIcon />
              <div className="mt-4">No holders to display</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Showcase holders in a Frame
      </div>
      <div className="mt-4 gap-7">
        <FrameLabel
          label="Customize"
          labelIcon="customize"
          labelIconSize={16}
        />
        <ToggleSwitch
          label="Use token held as the primary image"
          labelClassName="text-text-secondary"
          onClick={handleTokenPrimaryImageToggle}
          checked={isTokenImagePrimary}
        />
      </div>
      <div className="flex items-end max-sm:mt-8 mt-4 gap-6">
        <FrameURL
          containerClass="w-full"
          placeholder="Please select token type and chain"
          longUrl={frameUrl}
        />
      </div>
      <div className="max-sm:mt-8 mt-4">
        <FramePreview
          frameContainerClass="bg-gradient-to-b from-[#122230] to-[#051523] text-white"
          frameClass="!aspect-[1.91/1]"
          buttons={frameButtons}
        >
          {renderFrameContent()}
        </FramePreview>
      </div>
    </div>
  );
}

export function TokenHoldersFrameModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Tooltip
        content="Share as Farcaster frame"
        contentClassName={tooltipClass}
        disabled={isModalVisible}
      >
        <button
          className={classNames(
            'py-1.5 px-3 text-text-button bg-glass-1 rounded-full flex-row-center border border-solid border-transparent',
            {
              'border-white': isModalVisible
            }
          )}
          onClick={handleModalOpen}
        >
          <FrameIconBlue />
        </button>
      </Tooltip>
      {isModalVisible && (
        <Modal
          isOpen
          className="w-full max-sm:min-w-full max-w-[686px] px-2.5 overflow-y-auto"
          containerClassName="!border-white max-sm:p-4"
          onRequestClose={handleModalClose}
        >
          <ModalContent />
        </Modal>
      )}
    </>
  );
}
