import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import {
  GetPOAPsQuery,
  GetTokensQuery
} from '../../queries/frames/tokenBalancesQuery';
import { RoundedCopyButton } from '../CopyButton';
import { Icon, IconType } from '../Icon';
import LazyImage from '../LazyImage';
import { Modal } from '../Modal';
import { FrameInput } from './FrameInput';
import { FramePreview } from './FramePreview';
import { FrameSelect } from './FrameSelect';
import {
  FrameOption,
  Poap,
  TokenBalance,
  TokenBalanceFrameResponse,
  TokenBalanceFrameVariables
} from './types';
import {
  encodeFrameData,
  getFrameButtonsForTokenBalances,
  getResolvedOwner
} from './utils';

function FrameIconBlue() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <g clip-path="url(#a)">
        <path
          fill="#65AAD0"
          d="M0 14.0564c0 .6311.5117 1.1428 1.1428 1.1428h13.7143c.6312 0 1.1429-.5117 1.1429-1.1428V1.9421c0-.6312-.5117-1.1428-1.1429-1.1428H1.1428C.5117.7993 0 1.3109 0 1.942v12.1143ZM13.2571 2.3993c.6312 0 1.1429.5116 1.1429 1.1428v7.3143c0 .6312-.5117 1.1428-1.1429 1.1428H2.7428c-.6311 0-1.1428-.5116-1.1428-1.1428V3.5421c0-.6312.5117-1.1429 1.1428-1.1429h10.5143Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path
            fill="#fff"
            d="M0 0h16v16H0z"
            transform="matrix(1 0 0 -1 0 16)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

const ButtonOptions: FrameOption[] = [
  {
    label: 'POAPs',
    value: 'poap'
  },
  {
    label: 'NFTs on Ethereum',
    value: 'nft-ethereum'
  },
  {
    label: 'NFTs on Polygon',
    value: 'nft-polygon'
  },
  {
    label: 'NFTs on Zora',
    value: 'nft-zora'
  },
  {
    label: 'NFTs on Base',
    value: 'nft-base'
  }
];

const FRAMES_ENDPOINT = process.env.FRAMES_ENDPOINT || '';

const PLACEHOLDER_URL = 'images/placeholder.svg';

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
      : tokenBalance?.tokenNfts?.contentValue?.image?.small) || PLACEHOLDER_URL;

  const id = isPoap ? `#${poapEvent.eventId}` : `#${tokenBalance?.tokenId}`;

  const name = isPoap ? poapEvent.eventName : tokenBalance?.token?.name;

  return (
    <div className="w-[235px] h-[235px] aspect-square rounded-[18px] bg-secondary flex flex-col text-left justify-end overflow-hidden relative border border-solid border-white">
      <div className="absolute inset-0 flex-col-center">
        <LazyImage alt="asset-image" src={image} className="w-full" />
      </div>
      <div className="z-10 h-[70px] p-2.5 flex flex-col justify-end bg-gradient-to-b from-[#00000000] to-[#1B121C]">
        <div className="flex items-center gap-1">
          <span className="ellipsis max-w-[100px]">{id}</span>
          <Icon
            name={blockchain as IconType}
            height={18}
            width={18}
            className="border border-solid border-white rounded-full"
          />
          <span>{type}</span>
        </div>
        <div className="flex items-center justify-between text-[13px] font-bold">
          <span className="ellipsis max-w-[160px]">{name}</span>
          {!!symbol && <span>{symbol}</span>}
        </div>
      </div>
    </div>
  );
}

function ModalContent() {
  const [{ address }] = useSearchInput();

  const [selectedButtons, setSelectedButtons] = useState<
    (FrameOption | null)[]
  >([]);

  const { selectedButtonValues, isPOAP, tokenType, blockchain } =
    useMemo(() => {
      const selectedButtonValues = selectedButtons
        .filter(Boolean)
        .map(v => v?.value) as string[];
      if (selectedButtonValues.length < 2) {
        return {
          selectedButtonValues: [],
          isPOAP: null,
          tokenType: null,
          blockchain: null
        };
      }
      const buttonValue = selectedButtonValues?.[0] || '';
      const [tokenType, blockchain] = buttonValue.split('-');
      return {
        selectedButtonValues,
        isPOAP: tokenType === 'poap',
        tokenType,
        blockchain
      };
    }, [selectedButtons]);

  const selectedButtonCount = selectedButtonValues.length;

  const owner = address[0];

  const query = isPOAP ? GetPOAPsQuery : GetTokensQuery;

  const [fetch, { loading, error, data }] = useLazyQuery<
    TokenBalanceFrameResponse,
    TokenBalanceFrameVariables
  >(query);

  const fetchData = useCallback(() => {
    if (selectedButtonCount <= 2) {
      return;
    }
    const variables = isPOAP
      ? {
          owner,
          limit: 4
        }
      : {
          owner,
          limit: 4,
          tokenType: tokenType === 'erc20' ? ['ERC20'] : ['ERC721', 'ERC1155'],
          blockchain: blockchain
        };

    fetch(variables);
  }, [blockchain, fetch, isPOAP, owner, selectedButtonCount, tokenType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const wallet = data?.Wallet;

  const resolvedOwner = useMemo(() => {
    if (!wallet) {
      return {
        display: '',
        address: ''
      };
    }
    return getResolvedOwner(wallet);
  }, [wallet]);

  const frameUrl = useMemo(() => {
    if (selectedButtonValues.length <= 2) {
      return '';
    }
    const [b1, b2, b3] = selectedButtonValues;
    const frameData = encodeFrameData({
      b1,
      b2,
      b3,
      o: resolvedOwner.address,
      d: resolvedOwner.display
    });
    return `${FRAMES_ENDPOINT}/tb/${frameData}`;
  }, [resolvedOwner.address, resolvedOwner.display, selectedButtonValues]);

  const handleButtonSelect = (option: FrameOption, index: number) => {
    setSelectedButtons(prevButtons => {
      const newButtons = [...prevButtons];
      newButtons[index] = prevButtons[index] ? null : option;
      const buttonCount = newButtons.filter(Boolean).length;
      return buttonCount <= 3 ? newButtons : prevButtons;
    });
  };

  const handleRetry = () => {
    fetchData();
  };

  const renderFrameContent = () => {
    if (selectedButtonCount <= 2) {
      return (
        <div className="max-w-[400px] my-auto font-concert-one text-xl text-center">
          Please select any 3 buttons to generate your frame
        </div>
      );
    }

    if (loading) {
      return (
        <div className="my-auto flex-col-center gap-1 font-concert-one text-xl text-center">
          <img alt="Logo" src="/logo-white.svg" height={32} width={32} />
          Generating preview...
        </div>
      );
    }

    if (error) {
      return (
        <div className="my-auto flex-col-center gap-1 font-concert-one text-xl text-center">
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

    const items = data?.Poaps?.Poap || data?.TokenBalances?.TokenBalance || [];

    return (
      <div className="flex flex-col items-center h-full">
        <div className="font-concert-one text-xl text-center ellipsis max-w-[400px] mt-3.5 mb-6">
          {isPOAP
            ? `POAPs of ${resolvedOwner.display}`
            : `Token balances of ${resolvedOwner.display}`}
        </div>
        <div className="flex flex-wrap justify-center max-w-[580px] gap-6">
          {items.length ? (
            items.map((item, index) => <Token key={index} item={item} />)
          ) : (
            <div className="flex-col-center h-full font-concert-one text-xl text-center">
              No results to display
            </div>
          )}
        </div>
      </div>
    );
  };

  const frameButtons =
    selectedButtonCount <= 2
      ? undefined
      : getFrameButtonsForTokenBalances(selectedButtonValues);

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Share Token Balances as Farcaster Frame
      </div>
      <div className="flex mt-4 gap-7">
        <FrameSelect
          label="Select any three"
          labelIcon="token-balances"
          labelIconSize={16}
          options={ButtonOptions}
          selectedOptions={selectedButtons}
          onSelect={handleButtonSelect}
        />
      </div>
      <div className="flex items-end mt-4 gap-6">
        <FrameInput
          readOnly
          label="Frame URL"
          labelIcon="chain"
          containerClass="w-full"
          placeholder="Please select token type and chain"
          value={frameUrl}
        />
        <RoundedCopyButton value={frameUrl} />
      </div>
      <div className="mt-4">
        <FramePreview
          frameClass="bg-gradient-to-b from-[#122230] to-[#051523] text-white"
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
      <button
        title="Share Frame"
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
      {isModalVisible && (
        <Modal
          isOpen
          className="min-w-[648px] overflow-y-auto"
          containerClassName="!border-white"
          onRequestClose={handleModalClose}
        >
          <ModalContent />
        </Modal>
      )}
    </>
  );
}
