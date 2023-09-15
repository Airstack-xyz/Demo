import { useLazyQuery } from '@airstack/airstack-react';
import { Icon } from '../../../Components/Icon';
import { Token } from '../Token';
import {
  accountHolderQuery,
  erc20TokenDetailsQuery,
  poapDetailsQuery,
  tokenDetailsQuery
} from '../../../queries/tokenDetails';
import {
  Account,
  AccountHolderResponse,
  ERC20Response,
  Nft,
  TokenTransfer
} from '../erc20-types';
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
import { useTokenDetails } from '../../../store/tokenDetails';
import { getActiveTokensInfoFromArray } from '../../../utils/activeTokenInfoString';

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

function formatAccountHolderData(data: AccountHolderResponse) {
  if (!data) return null;

  const accounts = data?.Accounts?.Account;

  if (!accounts) return null;
  let depth = 1;
  function getOwner(accounts: Account[]): string {
    depth++;
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      if (account?.nft?.tokenBalances?.length > 0) {
        account?.nft?.tokenBalances.forEach(token => {
          token.owner.accounts.length > 0;
        });
        for (let i = 0; i < account?.nft?.tokenBalances?.length; i++) {
          const token = account?.nft?.tokenBalances[i];
          if (token?.owner?.accounts.length === 0) {
            return token?.owner?.identity;
          } else {
            return getOwner(token?.owner?.accounts);
          }
        }
      }
    }
    return '';
  }
  const ownerAddress = getOwner(accounts);

  return {
    ownerAddress,
    hasParent: depth > 2
  };
}

type Token = {
  tokenId: string;
  eventId?: string;
  blockchain: string;
  tokenAddress: string;
};

export function TokenDetails(props: {
  hideBackBreadcrumb?: boolean;
  onClose?: () => void;
  showLoader?: boolean;
  activeTokens: Token[];
}) {
  const { showLoader, activeTokens, hideBackBreadcrumb, onClose } = props;
  const { tokenId, eventId, blockchain, tokenAddress } =
    activeTokens[activeTokens.length - 1];

  const [{ address, rawInput, inputType }, setSearchData] = useSearchInput();
  const navigate = useNavigate();
  const isTokenBalances = !!useMatch('/token-balances');
  const addressRef = useRef(address.join(','));
  const setDetails = useTokenDetails(['hasERC6551'])[1];

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

  const [
    fetchAccoutHolders,
    { data: _accountHoldersData, loading: loadingAccountHolder }
  ] = useLazyQuery(
    accountHolderQuery,
    {},
    {
      dataFormatter: formatAccountHolderData
    }
  );

  const accountHoldersData = _accountHoldersData as ReturnType<
    typeof formatAccountHolderData
  >;

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

  // eslint-disable-next-line
  const nft: Nft = nftData?.nft || ({} as Nft);
  const transfterDetails: TokenTransfer =
    nftData?.transferDetails || ({} as TokenTransfer);

  useEffect(() => {
    if (!nft?.tokenBalance) return;
    const ownerId = nft?.tokenBalance?.owner?.identity;
    if (ownerId) {
      fetchAccoutHolders({
        blockchain,
        address: ownerId
      });
    }
  }, [blockchain, fetchAccoutHolders, nft]);

  useEffect(() => {
    setDetails({
      hasERC6551: !isPoap && nft?.erc6551Accounts?.length > 0
    });
  }, [isPoap, nft?.erc6551Accounts?.length, setDetails]);

  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      const updatedTokens = activeTokens.slice(0, index + 1);
      setSearchData(
        {
          activeTokenInfo: getActiveTokensInfoFromArray(updatedTokens)
        },
        {
          updateQueryParams: true
        }
      );
    },
    [activeTokens, setSearchData]
  );

  const activeTokenId = isPoap ? poap?.eventId : nft?.tokenId;

  const loading = showLoader || loadingToken || loadingERC20 || loadingPoap;
  const hasChildren = !loading && !isPoap && nft?.erc6551Accounts?.length > 0;

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
            <span className="text-text-secondary">/</span>
          </div>
        )}
        {activeTokens.map((token, index) => {
          const _tokenId = token.tokenId || token.eventId;
          const isActiveToken = activeTokenId === _tokenId;
          return (
            <div
              className={classNames('flex items-center overflow-hidden', {
                'skeleton-loader': loading,
                'flex-1': isActiveToken
              })}
            >
              <button
                className={classNames('flex cursor-auto px-1 py-0.5', {
                  'hover:bg-glass-1-light rounded-18 !cursor-pointer':
                    !isActiveToken
                })}
                onClick={() => {
                  if (!isActiveToken) {
                    handleBreadcrumbClick(index);
                  }
                }}
              >
                <Icon
                  name="table-view"
                  height={20}
                  width={20}
                  className="mr-1"
                />{' '}
                <span
                  data-loader-type="block"
                  data-loader-width="50"
                  className="min-h-[20px] flex items-center overflow-hidden"
                >
                  {!loading && isActiveToken ? (
                    <>
                      <span className=" ellipsis">
                        Details of{' '}
                        {isPoap ? poap?.poapEvent.eventName : nft?.token?.name}
                      </span>
                      (
                      <span className="min-w-[20px] max-w-[100px] ellipsis">
                        #{activeTokenId}
                      </span>
                      )
                    </>
                  ) : (
                    <span>#{_tokenId}</span>
                  )}
                </span>
              </button>
              {index !== activeTokens.length - 1 && (
                <span className="mx-1 text-text-secondary">/</span>
              )}
            </div>
          );
        })}
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
              key={`${tokenAddress}-${tokenId}-${blockchain}`}
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
              <NFTInfo
                nft={nft}
                tokenId={tokenId}
                blockchain={blockchain}
                tokenAddress={tokenAddress}
                transfterDetails={transfterDetails}
                loadingHolder={loadingAccountHolder}
                holderData={!loadingAccountHolder ? accountHoldersData : null}
              />
            )}
          </>
        )}
        {loading && <LoaderInfo />}
      </div>
      {hasChildren && (
        <NestedTokens
          tokenId={tokenId}
          blockchain={blockchain}
          tokenAddress={tokenAddress}
          key={`${tokenAddress}-${tokenId}-${blockchain}`}
        />
      )}
    </div>
  );
}
