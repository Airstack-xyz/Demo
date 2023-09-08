import { useLazyQuery } from '@airstack/airstack-react';
import { Icon } from '../../../Components/Icon';
import { Token } from '../Token';
import {
  erc20TokenDetailsQuery,
  poapDetailsQuery,
  tokenDetailsQuery
} from '../../../queries/tokenDetails';
import { ERC20Response, Nft, TokenTransfer } from '../erc20-types';
import { NestedTokens } from './NestedTokens';
import { useCallback, useEffect, useRef } from 'react';
import {
  Link,
  createSearchParams,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { PoapData } from './types';
import { PoapInfo } from './PoapInfo';
import { NFTInfo, TokenERC20Info } from './NFTInfo';
import { createTokenHolderUrl } from '../../../utils/createTokenUrl';
import classNames from 'classnames';

function LoaderItem() {
  return (
    <div className=" flex">
      <div
        data-loader-type="block"
        data-loader-height="30"
        className="w-[20%] mr-5"
      ></div>
      <div
        data-loader-type="block"
        data-loader-width="50"
        data-loader-height="30"
      ></div>
    </div>
  );
}

function LoaderInfo() {
  return (
    <div className="skeleton-loader w-full [&>div]:h-8 [&>div]:mb-9">
      <LoaderItem />
      <LoaderItem />
      <LoaderItem />
      <LoaderItem />
      <LoaderItem />
    </div>
  );
}

function formatNFTData(data: ERC20Response) {
  if (!data) return {};
  return {
    nft: {
      ...data?.nft,
      tokenBalance: data?.nft.tokenBalances?.[0]
    },
    transferDetails: data?.transfers?.TokenTransfer[0]
  };
}

function formatPoapData(data: PoapData) {
  if (!data) return {};
  return {
    poap: data?.poap?.Poap?.[0] || null,
    transferDetails: data?.tokenTransfer?.TokenTransfer?.[0]
  };
}

/* ERC 721 with 6551
{
      blockchain: 'ethereum',
      tokenAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      tokenId: '6813'
    },
  */

export function TokenDetails(props: {
  tokenId: string;
  eventId?: string;
  blockchain: string;
  tokenAddress: string;
  hideBackBreadcrumb?: boolean;
  onClose?: () => void;
}) {
  const {
    tokenId,
    eventId,
    blockchain,
    tokenAddress,
    hideBackBreadcrumb,
    onClose
  } = props;

  const [{ address, rawInput, inputType }] = useSearchInput();
  const navigate = useNavigate();
  const isTokenBalances = !!useMatch('/token-balances');
  const addressRef = useRef(address.join(','));

  const [fetchToken, { data, loading: loadingToken }] = useLazyQuery(
    tokenDetailsQuery,
    {
      tokenId,
      blockchain,
      tokenAddress
    },
    { dataFormatter: formatNFTData }
  );

  const [fetchERC20Token, { data: erc20Data, loading: loadingERC20 }] =
    useLazyQuery(erc20TokenDetailsQuery, {
      blockchain,
      tokenAddress
    });

  const [fetchPoap, { data: _poapData, loading: loadingPoap }] = useLazyQuery(
    poapDetailsQuery,
    {
      tokenAddress,
      eventId
    },
    { dataFormatter: formatPoapData }
  );

  useEffect(() => {
    // close if address changes
    if (addressRef.current && addressRef.current !== address.join(',')) {
      onClose?.();
    }
  }, [address, onClose]);

  const erc20Token = erc20Data?.Token;
  const nftData: ReturnType<typeof formatNFTData> = data;
  const poapData: ReturnType<typeof formatPoapData> = _poapData;

  const isPoap = Boolean(eventId);
  const poap = poapData?.poap;

  useEffect(() => {
    // is poap
    if (isPoap) {
      fetchPoap();
    } else if (tokenId) {
      fetchToken();
    } else {
      fetchERC20Token();
    }
  }, [fetchERC20Token, fetchPoap, fetchToken, isPoap, tokenAddress, tokenId]);

  const handleClose = useCallback(() => {
    const searchData = {
      address: address.join(','),
      rawInput,
      inputType: inputType || ''
    };
    onClose?.();
    navigate({
      pathname: isTokenBalances ? '/token-balances' : '/token-holders',
      search: createSearchParams(searchData).toString()
    });
  }, [address, inputType, isTokenBalances, navigate, onClose, rawInput]);

  const nft: Nft = nftData?.nft || ({} as Nft);
  const transfterDetails: TokenTransfer =
    nftData?.transferDetails || ({} as TokenTransfer);

  const hasChildren = !isPoap && nft?.erc6551Accounts?.length > 0;
  const loading = loadingToken || loadingERC20 || loadingPoap;

  return (
    <div className="max-w-[950px] text-sm m-auto w-[98vw] pt-10 sm:pt-0">
      <div className="flex items-center mb-7">
        {!hideBackBreadcrumb && (
          <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-1">
            <div
              className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
              onClick={handleClose}
            >
              <Icon
                name={isTokenBalances ? 'token-balances' : 'token-holders'}
                height={20}
                width={20}
              />{' '}
              <span className="ml-1.5 text-text-secondary break-all cursor-pointer max-w-[90%] sm:max-w-[500px] ellipsis">
                Token {isTokenBalances ? 'balances' : 'holders'} of{' '}
                {address.join(', ')}
              </span>
            </div>
            <span className="mr-2 text-text-secondary">/</span>
          </div>
        )}
        <div
          className={classNames('flex items-center flex-1 overflow-hidden', {
            'skeleton-loader': loading
          })}
        >
          <Icon name="table-view" height={20} width={20} className="mr-1" />{' '}
          <span
            data-loader-type="block"
            data-loader-width="50"
            className="min-h-[20px] flex items-center overflow-hidden"
          >
            {!loading && (
              <>
                <span className="mr-1 ellipsis">
                  Details of{' '}
                  {isPoap ? poap?.poapEvent.eventName : nft?.token?.name}
                </span>
                (
                <span className="min-w-[20px] max-w-[100px] ellipsis">
                  #{isPoap ? poap?.eventId : nft?.tokenId}
                </span>
                )
              </>
            )}
          </span>
        </div>
      </div>
      <div className="bg-glass border-solid-stroke rounded-18 flex p-5 flex-col md:flex-row">
        <div className="flex flex-col items-center mr-0 sm:mr-7">
          <div
            className={classNames({
              'skeleton-loader': loading
            })}
          >
            <Token
              token={(erc20Data?.Token || poap || nft) as Nft}
              hideHoldersButton
              disabled
            />
          </div>
          <div className="flex justify-center">
            <Link
              className={classNames('flex py-2 px-10 mt-7  rounded-18', {
                'bg-button-primary': !loading,
                'skeleton-loader': loading
              })}
              data-loader-type="block"
              to={createTokenHolderUrl({
                address: (isPoap
                  ? poap?.eventId
                  : erc20Token?.address || nft.address) as string,
                inputType: isPoap ? 'POAP' : 'ADDRESS',
                type: isPoap ? 'POAP' : erc20Token?.type || nft.type,
                blockchain,
                label:
                  (isPoap
                    ? poap?.poapEvent?.eventName
                    : erc20Token?.name || nft?.token?.name) || '--'
              })}
            >
              <Icon name="token-holders-white" />
              <span className="ml-1.5 font-medium">View holders</span>
            </Link>
          </div>
        </div>
        {!loading && (
          <>
            {isPoap && poap ? (
              <PoapInfo
                poap={poap}
                transfterDetails={poapData.transferDetails}
              />
            ) : erc20Token ? (
              <TokenERC20Info token={erc20Token} />
            ) : (
              <NFTInfo nft={nft} transfterDetails={transfterDetails} />
            )}
          </>
        )}
        {loading && <LoaderInfo />}
      </div>
      {hasChildren && <NestedTokens {...props} />}
    </div>
  );
}