import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchInput } from '../../hooks/useSearchInput';
import { tokenBalancesFrameQuery } from '../../queries/frames/tokenBalancesQuery';
import { TokenBlockchain } from '../../types';
import { isMobileDevice } from '../../utils/isMobileDevice';
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
import { FrameIconBlue } from './Icons';
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
          label="Select up to three"
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

  const [isDesktopModalVisible, setIsDesktopModalVisible] = useState(false);

  const isMobile = isMobileDevice();

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleDesktopModalOpen = () => {
    setIsDesktopModalVisible(true);
  };

  const handleDesktopModalClose = () => {
    setIsDesktopModalVisible(false);
  };

  return (
    <>
      <Tooltip
        content="Share as Farcaster frame"
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
          onClick={isMobile ? handleDesktopModalOpen : handleModalOpen}
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
      {isDesktopModalVisible && (
        <Modal
          isOpen={isDesktopModalVisible}
          hideDefaultContainer
          className="bg-transparent min-h-[400px] min-w-[400px] outline-none px-5"
          overlayClassName="bg-white bg-opacity-10 backdrop-blur-[50px] flex flex-col justify-center items-center fixed inset-0 z-[100]"
          onRequestClose={handleDesktopModalClose}
        >
          <div className="bg-primary backdrop-blur-[100px] p-5 border-solid-stroke rounded-xl text-center">
            <div className="text-base font-bold">
              Use desktop web to share as Farcaster frame
            </div>
            <div className="text-sm text-text-secondary pt-1 pb-2">
              There is more on desktop. Fork code, SDKs, AI Assistant, and more!
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
