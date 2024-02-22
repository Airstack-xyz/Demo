import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { tokenBalancesFrameQuery } from '../../queries/frames/tokenBalancesQuery';
import { TokenBlockchain } from '../../types';
import { Icon, IconType } from '../Icon';
import LazyImage from '../LazyImage';
import { Modal } from '../Modal';
import { Tooltip, tooltipClass } from '../Tooltip';
import { FramePreview } from './FramePreview';
import {
  FrameSelect,
  FrameSelectOption,
  FrameSelectOptionState
} from './FrameSelect';
import { FrameURL } from './FrameURL';
import {
  DECODED_BLOCKCHAIN,
  DECODED_TOKEN_TYPE,
  ENCODED_BLOCKCHAIN,
  ENCODED_TOKEN_TYPE
} from './constants';
import {
  FrameOption,
  Poap,
  TokenBalance,
  TokenBalanceFrameResponse,
  TokenBalanceFrameVariables
} from './types';
import {
  encodeFrameData,
  getDisplayName,
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
      <g fill="#65AAD0" clip-path="url(#a)">
        <path d="M0 14.8571C0 15.4883.5117 16 1.1428 16h13.7143C15.4883 16 16 15.4883 16 14.8571V1.1428C16 .5117 15.4883 0 14.8571 0H1.1428C.5117 0 0 .5117 0 1.1428v13.7143ZM13.8572 1.1429c.6312 0 1.1428.5116 1.1428 1.1428v11.4286c0 .6312-.5116 1.1428-1.1428 1.1428H2.1429C1.5117 14.8571 1 14.3455 1 13.7143V2.2857c0-.6312.5117-1.1428 1.1429-1.1428h11.7143Z" />
        <path d="M11.8532 11.5041v-.0723c0-.1859-.1085-.346-.2583-.4338h.0155V6.3235l.3564-1.0382h-1.3894V4.247h-5.16v1.0382H4.0278l.3564 1.0382v4.6745h.0155c-.155.0878-.2583.2427-.2583.4338v.0723c-.16.0672-.2737.2273-.2737.4184V12h3.0991v-.0775c0-.1859-.1136-.346-.2737-.4184v-.0723c0-.1859-.1085-.346-.2583-.4338h.0206V8.6581c0-.8316.6715-1.5082 1.498-1.5082h.093c.8263 0 1.4978.6766 1.4978 1.5082v2.3399h.0207c-.155.0878-.2583.2427-.2583.4338v.0723c-.16.0672-.2737.2273-.2737.4184V12h3.0991v-.0775c0-.1859-.1137-.346-.2738-.4184h-.0051Z" />
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

function EmptyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="78"
      height="54"
      fill="none"
      viewBox="0 0 78 54"
    >
      <path
        fill="#fff"
        d="M27.1253 26.1961 5.7798 21.927v19.4918l26.2138 6.9842V16.7217l-3.8197 8.9127c-.1873.4119-.6179.6366-1.0486.5617Z"
      />
      <path
        fill="#fff"
        d="M31.5629 12.9384 7.6896 9.9425 29.391 1.91l24.36 3.239-19.5854 7.546 4.8683 11.3468 24.3226-10.4293-6.4598-9.6617L29.1662 0 3.6077 9.437.4434 18.9488l4.5686.9175h.0188l21.72 4.344 4.8121-11.2719Z"
      />
      <path
        fill="#fff"
        d="M63.1695 25.9152c-1.0673 0-2.0971.1124-3.0895.3558v-9.2123l-21.177 9.0625c-.1123.0562-.2434.0749-.3557.0749-.3745 0-.7116-.206-.8614-.5617l-3.8197-8.9127v31.6625l15.8968-4.2316c1.7788 5.7108 7.1152 9.8489 13.4065 9.8489 7.7518 0 14.0431-6.2913 14.0431-14.0431 0-7.7518-6.2913-14.0432-14.0431-14.0432Zm0 26.2139c-5.4113 0-10.0174-3.5576-11.5902-8.4634-.3745-1.1609-.5805-2.4154-.5805-3.7073 0-5.636 3.8572-10.392 9.0812-11.7588.9924-.2809 2.0222-.4119 3.0895-.4119 6.7033 0 12.1707 5.4674 12.1707 12.1707 0 6.7032-5.4674 12.1707-12.1707 12.1707Z"
      />
      <path
        fill="#fff"
        d="m70.4527 35.3323-2.6401-2.6401c-.3744-.3745-.9549-.3745-1.3294 0l-3.3141 3.2954-3.3142-3.3142c-.3745-.3744-.955-.3744-1.3294 0l-2.6401 2.6401c-.2809.2809-.3371.6554-.206.9737.0562.1311.1123.2434.206.337l3.3141 3.3142-3.3141 3.3142c-.3745.3745-.3745.9549 0 1.3294l2.6401 2.6401c.3744.3745.9549.3745 1.3294 0l3.3142-3.2767 3.3141 3.3142c.3745.3744.955.3744 1.3294 0l2.6401-2.6401c.3745-.3745.3745-.955 0-1.3295l-3.3141-3.3141 3.3141-3.3142c.3745-.3745.3745-.9549 0-1.3294Z"
      />
    </svg>
  );
}

const buttonOptions: FrameSelectOption[] = [
  {
    label: 'NFTs on Ethereum',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.ETHEREUM}`,
    disabledTooltip: "This wallet doesn't have NFTs on Ethereum"
  },
  {
    label: 'NFTs on Base',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.BASE}`,
    disabledTooltip: "This wallet doesn't have NFTs on Base"
  },
  {
    label: 'NFTs on Zora',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.ZORA}`,
    disabledTooltip: "This wallet doesn't have NFTs on Zora"
  },
  {
    label: 'NFTs on Polygon',
    value: `${ENCODED_TOKEN_TYPE.NFT}-${ENCODED_BLOCKCHAIN.POLYGON}`,
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

const FRAMES_ENDPOINT = process.env.FRAMES_ENDPOINT || '';

const PLACEHOLDER_URL = 'images/placeholder-blue.svg';

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
      isPOAP: tokenType === 'poap',
      tokenType,
      blockchain
    };
  }, [buttonOptionsState]);

  const shouldFetchData = selectedButtonValues.length >= 1;

  const owner = address[0];

  const handleOnComplete = useCallback((data: TokenBalanceFrameResponse) => {
    setButtonOptionsState(prevState => {
      const newState = [...prevState];
      if (data?.ethereum?.TokenBalance?.length === 0) {
        newState[0] = 'disabled';
      }
      if (data?.base?.TokenBalance?.length === 0) {
        newState[1] = 'disabled';
      }
      if (data?.zora?.TokenBalance?.length === 0) {
        newState[2] = 'disabled';
      }
      if (data?.polygon?.TokenBalance?.length === 0) {
        newState[3] = 'disabled';
      }
      if (data?.poap?.Poap?.length === 0) {
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
        <div className="max-w-[400px] my-auto font-concert-one text-xl text-center">
          Please select token type and chain from above to generate frame
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

    const items =
      (isPOAP
        ? data?.poap.Poap
        : data?.[blockchain as TokenBlockchain]?.TokenBalance) || [];

    const displayName = getDisplayName(resolvedOwner);

    return (
      <div className="flex flex-col items-center h-full">
        <div className="font-concert-one text-xl text-center mt-3.5 mb-6 flex">
          <span className="ellipsis max-w-[250px]">{displayName}</span>'s
          Onchain Collection
        </div>
        <div className="flex flex-wrap justify-center max-w-[580px] gap-6 h-full">
          {items.length ? (
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
    ? getFrameButtonsForTokenBalances(selectedButtonValues)
    : undefined;

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Showcase NFTs in a Frame
      </div>
      <div className="flex mt-4 gap-7">
        <FrameSelect
          label="Select any three"
          labelIcon="token-balances"
          labelIconSize={16}
          options={buttonOptions}
          optionsState={buttonOptionsState}
          onSelect={handleButtonSelect}
        />
      </div>
      <div className="flex items-end mt-4 gap-6">
        <FrameURL
          containerClass="w-full"
          placeholder="Please select token type and chain"
          longUrl={frameUrl}
        />
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
      <Tooltip
        content="Create farcaster frame for token balances"
        contentClassName={tooltipClass}
        disabled={isModalVisible}
      >
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
      </Tooltip>
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
