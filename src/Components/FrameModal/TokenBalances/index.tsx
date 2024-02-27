import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { tokenBalancesFrameQuery } from '../../../queries/frames/tokenBalancesQuery';
import { TokenBlockchain } from '../../../types';
import { Icon, IconType } from '../../Icon';
import LazyImage from '../../LazyImage';
import { Modal } from '../../Modal';
import { Tooltip, tooltipClass } from '../../Tooltip';
import { FramePreview } from '../FramePreview';
import {
  FrameSelectOption,
  FrameSelectOptionState,
  FrameSelect
} from '../FrameSelect';
import { FrameURL } from '../FrameURL';
import { EmptyIcon, FrameIconBlue } from '../Icons';
import {
  Poap,
  TokenBalance,
  TokenBalanceFrameResponse,
  TokenBalanceFrameVariables
} from './types';
import { FrameOption } from '../types';
import { getFrameButtons, getResolvedOwner } from './utils';
import { encodeFrameData, getDisplayName } from '../utils';
import {
  DECODED_BLOCKCHAIN,
  DECODED_TOKEN_TYPE,
  ENCODED_BLOCKCHAIN,
  ENCODED_TOKEN_TYPE,
  FRAMES_ENDPOINT,
  PLACEHOLDER_URL
} from '../constants';

const buttonOptions: FrameSelectOption[] = [
  {
    label: 'NFTs on Ethereum',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.ethereum}`,
    disabledTooltip: "This wallet doesn't have NFTs on Ethereum"
  },
  {
    label: 'NFTs on Base',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.base}`,
    disabledTooltip: "This wallet doesn't have NFTs on Base"
  },
  {
    label: 'NFTs on Zora',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.zora}`,
    disabledTooltip: "This wallet doesn't have NFTs on Zora"
  },
  {
    label: 'NFTs on Polygon',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.polygon}`,
    disabledTooltip: "This wallet doesn't have NFTs on Polygon"
  },
  {
    label: 'POAPs',
    value: `${ENCODED_TOKEN_TYPE.POAP}`,
    disabledTooltip: "This wallet doesn't have POAPs"
  }
];

const defaultButtonOptionsState: FrameSelectOptionState[] = [
  'selected',
  'selected',
  'selected',
  null,
  null,
  null
];

function Token({ item }: { item: Poap | TokenBalance }) {
  const tokenBalance = item as TokenBalance;
  const poap = item as Poap;

  const blockchain = item?.blockchain;

  const symbol = tokenBalance?.token?.symbol || '';

  const isPoap = Boolean(poap?.poapEvent);

  const poapEvent = poap?.poapEvent || {};

  const type = isPoap ? 'POAP' : tokenBalance?.tokenType;

  const image =
    (isPoap
      ? poapEvent?.contentValue?.image?.small
      : tokenBalance?.tokenNfts?.contentValue?.image?.small ||
        tokenBalance?.token?.logo?.small ||
        tokenBalance?.token?.projectDetails?.imageUrl) || PLACEHOLDER_URL;

  const id = isPoap ? `#${poapEvent.eventId}` : `#${tokenBalance?.tokenId}`;

  const name = isPoap ? poapEvent.eventName : tokenBalance?.token?.name;

  return (
    <div className="w-[calc(50%-16px)] aspect-square rounded-[18px] bg-secondary flex flex-col text-left justify-end overflow-hidden relative border border-solid border-white">
      <div className="absolute inset-0 flex-col-center">
        <LazyImage
          alt="TokenImage"
          src={image}
          fallbackSrc={PLACEHOLDER_URL}
          className="w-full"
        />
      </div>
      <div className="z-10 max-sm:h-[50px] h-[70px] max-sm:p-1.5 p-2.5 flex flex-col justify-end bg-gradient-to-b from-[#00000000] to-[#1B121C]">
        <div className="flex items-center gap-1 max-sm:text-[10px]">
          <span className="ellipsis max-sm:max-w-[40px] max-w-[100px]">
            {id}
          </span>
          <Icon
            name={blockchain as IconType}
            className="aspect-square max-sm:h-[13px] max-sm:w-[13px] h-[18px] w-[18px] border border-solid border-white rounded-full"
          />
          <span>{type}</span>
        </div>
        <div className="flex items-center justify-between max-sm:text-[10px] text-[13px] font-bold">
          <span className="ellipsis max-sm:max-w-[60px] max-w-[160px]">
            {name}
          </span>
          {!!symbol && <span>{symbol}</span>}
        </div>
      </div>
    </div>
  );
}

function ModalContent() {
  const [{ address }] = useSearchInput();

  const [buttonOptionsState, setButtonOptionsState] = useState(
    defaultButtonOptionsState
  );

  const { selectedButtonValues, isPOAP, blockchain } = useMemo(() => {
    const selectedButtonValues: string[] = [];
    buttonOptions.forEach((option, index) => {
      if (buttonOptionsState[index] === 'selected') {
        selectedButtonValues.push(option.value);
      }
    });
    if (selectedButtonValues.length === 0) {
      return {
        selectedButtonValues: [],
        isPOAP: null,
        tokenType: null,
        blockchain: null
      };
    }

    const firstButtonValue = selectedButtonValues?.[0] || '';
    const [encodeTokenType, encodedBlockchain] = firstButtonValue.split('-');

    const tokenType = DECODED_TOKEN_TYPE[encodeTokenType];
    const blockchain = DECODED_BLOCKCHAIN[encodedBlockchain];

    return {
      selectedButtonValues,
      isPOAP: tokenType === 'POAP',
      tokenType,
      blockchain
    };
  }, [buttonOptionsState]);

  const shouldFetchData = selectedButtonValues.length >= 1;

  const owner = address[0];

  const handleOnComplete = useCallback((data: TokenBalanceFrameResponse) => {
    setButtonOptionsState(prevState => {
      const newState = [...prevState];
      if (!data?.ethereum?.TokenBalance?.length) {
        newState[0] = 'disabled';
      }
      if (!data?.base?.TokenBalance?.length) {
        newState[1] = 'disabled';
      }
      if (!data?.zora?.TokenBalance?.length) {
        newState[2] = 'disabled';
      }
      if (!data?.polygon?.TokenBalance?.length) {
        newState[3] = 'disabled';
      }
      if (!data?.poap?.Poap?.length) {
        newState[4] = 'disabled';
      }
      return newState;
    });
  }, []);

  const [fetch, { loading, error, data }] = useLazyQuery<
    TokenBalanceFrameResponse,
    TokenBalanceFrameVariables
  >(tokenBalancesFrameQuery, undefined, {
    onCompleted: handleOnComplete
  });

  const fetchData = useCallback(() => {
    fetch({
      owner,
      limit: 4,
      tokenType: ['ERC721', 'ERC1155']
    });
  }, [fetch, owner]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const items = isPOAP
    ? data?.poap?.Poap
    : data?.[blockchain as TokenBlockchain]?.TokenBalance;

  const wallet = data?.wallet;

  const resolvedOwner = useMemo(() => getResolvedOwner(wallet), [wallet]);

  const frameUrl = useMemo(() => {
    if (!shouldFetchData || !resolvedOwner) {
      return '';
    }
    const frameData = encodeFrameData({
      b1: selectedButtonValues[0],
      b2: selectedButtonValues[1],
      b3: selectedButtonValues[2],
      o: resolvedOwner
    });
    return `${FRAMES_ENDPOINT}/tb/${frameData}`;
  }, [resolvedOwner, selectedButtonValues, shouldFetchData]);

  const handleButtonSelect = (_: FrameOption, index: number) => {
    setButtonOptionsState(prevState => {
      const newState = [...prevState];
      newState[index] = newState[index] === 'selected' ? null : 'selected';
      const count = newState.filter(v => v === 'selected').length;
      if (count > 3) {
        for (let i = 0; i < buttonOptions.length; i += 1) {
          if (i !== index && newState[i]) {
            newState[i] = null;
            break;
          }
        }
      }
      return newState;
    });
  };

  const handleRetry = () => {
    fetchData();
  };

  const renderFrameContent = () => {
    if (!shouldFetchData) {
      return (
        <div className="max-w-[400px] my-auto font-concert-one max-sm:text-base text-xl text-center">
          Please select token type and chain from above to generate frame
        </div>
      );
    }

    if (loading) {
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

    const displayName = getDisplayName(resolvedOwner);

    return (
      <div className="flex flex-col items-center w-full h-full">
        <div className="font-concert-one max-sm:text-sm text-xl text-center max-sm:mt-2 mt-3.5 flex">
          <span className="ellipsis max-sm:max-w-[90px] max-w-[250px]">
            {displayName}
          </span>
          's Onchain Collection
        </div>
        <div className="flex flex-wrap justify-center max-sm:gap-[14px] gap-[25px] h-full w-full max-sm:py-3 max-sm:px-4 py-4 px-6">
          {items?.length ? (
            items.map((item, index) => <Token key={index} item={item} />)
          ) : (
            <div className="flex-col-center font-concert-one text-xl text-center">
              <EmptyIcon />
              <div className="mt-4">
                No {isPOAP ? 'POAPs' : `${blockchain} tokens`} to display
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const frameButtons = shouldFetchData
    ? getFrameButtons(selectedButtonValues)
    : undefined;

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Showcase NFTs in a Frame
      </div>
      <div className="flex mt-4 gap-7">
        <FrameSelect
          label="Select up to three"
          labelIcon="token-balances"
          labelIconSize={16}
          options={buttonOptions}
          optionsState={buttonOptionsState}
          onSelect={handleButtonSelect}
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
          buttons={frameButtons}
        >
          {renderFrameContent()}
        </FramePreview>
      </div>
    </div>
  );
}

export function TokenBalancesFrameModal() {
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
