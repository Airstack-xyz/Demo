import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { Tokens } from './Tokens/Tokens';
import { HoldersOverview } from './Overview/Overview';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { TokenTotalSupplyQuery } from '../../queries';
import classNames from 'classnames';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Icon } from '../../Components/Icon';
import { OverviewDetails } from './OverviewDetails/OverviewDetails';
import { getRequestFilters } from './OverviewDetails/Tokens/filters';
import { POAPSupplyQuery } from '../../queries/overviewDetailsTokens';
import { getFilterablePoapsQuery } from '../../queries/overviewDetailsPoap';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../../queries/commonNftOwnersQuery';
import { sortAddressByPoapFirst } from '../../utils/sortAddressByPoapFirst';
import { getCommonPoapAndNftOwnersQuery } from '../../queries/commonPoapAndNftOwnersQuery';
import { createCommonOwnersPOAPsQuery } from '../../queries/commonOwnersPOAPsQuery';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../queries/commonNftOwnersQueryWithFilters';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../queries/commonPoapAndNftOwnersQueryWithFilters';
import { useMatch } from 'react-router-dom';
import {
  useOverviewTokens,
  TokenHolder as TokenAndHolder
} from '../../store/tokenHoldersOverview';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import {
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery,
  erc20TokenDetailsQuery
} from '../../queries/tokenDetails';

export function TokenHolders() {
  const [
    { address: tokenAddress, activeView, tokenFilters, activeTokenInfo },
    setData
  ] = useSearchInput();
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);
  const [showTokensOrOverview, setShowTokensOrOverview] = useState(true);

  const addressRef = useRef<null | string[]>(null);
  const isHome = useMatch('/');

  const query = tokenAddress.length > 0 ? tokenAddress[0] : '';

  useEffect(() => {
    setShowTokensOrOverview(true);
  }, [tokenAddress]);

  const tokenListKey = useMemo(() => {
    return tokenAddress.join(',');
  }, [tokenAddress]);

  const tokenAddressString = tokenAddress.join(',');
  const tokenAddressRef = useRef(tokenAddressString);

  useEffect(() => {
    if (
      tokenAddressRef.current &&
      tokenAddressRef.current !== tokenAddressString &&
      activeTokenInfo
    ) {
      // remove activeTokenInfo if user input address has changed
      setData(
        {
          activeTokenInfo: ''
        },
        {
          updateQueryParams: true
        }
      );
    }
  }, [activeTokenInfo, setData, tokenAddressString]);

  useEffect(() => {
    // go to token-holders page if user input address has changed
    if (addressRef.current && addressRef.current !== tokenAddress) {
      setData(
        {
          activeView: ''
        },
        {
          updateQueryParams: true
        }
      );
    }
    addressRef.current = tokenAddress;
  }, [tokenAddress, setData]);

  const isPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const address = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, isPoap);
  }, [isPoap, tokenAddress, overviewTokens]);

  const hasSomePoap = address.some(token => !token.address.startsWith('0x'));

  const tokenOwnersQuery = useMemo(() => {
    if (address.length === 0) return '';
    if (address.length === 1) return getNftOwnersQuery(address[0].address);
    if (hasSomePoap) {
      const sortedAddress = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQuery(sortedAddress[0], sortedAddress[1]);
    }
    return getCommonNftOwnersQuery(address[0], address[1]);
  }, [address, hasSomePoap]);

  const tokensQueryWithFilter = useMemo(() => {
    if (address.length === 0) return '';

    const requestFilters = getRequestFilters(tokenFilters);
    if (address.length === 1) {
      return getNftOwnersQueryWithFilters(
        address[0].address,
        Boolean(requestFilters?.socialFilters),
        requestFilters?.hasPrimaryDomain
      );
    }
    if (hasSomePoap) {
      const sortedAddresses = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQueryWithFilters(
        sortedAddresses[0],
        sortedAddresses[1],
        Boolean(requestFilters?.socialFilters),
        requestFilters?.hasPrimaryDomain
      );
    }
    return getCommonNftOwnersQueryWithFilters(
      address[0],
      address[1],
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
  }, [address, hasSomePoap, tokenFilters]);

  const token = useMemo(() => {
    const [tokenAddress, tokenId, blockchain, eventId] =
      activeTokenInfo.split(' ');
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  }, [activeTokenInfo]);

  const options = useMemo(() => {
    if (address.length === 0) return [];

    if (activeView) {
      const requestFilters = getRequestFilters(tokenFilters);
      let combinationsQueryLink = '';
      if (isPoap) {
        const combinationsQuery = getFilterablePoapsQuery(
          address,
          Boolean(requestFilters?.socialFilters),
          requestFilters?.hasPrimaryDomain
        );
        combinationsQueryLink = createAppUrlWithQuery(combinationsQuery, {
          limit: 200,
          ...requestFilters
        });
      } else {
        combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
          limit: 200,
          ...requestFilters
        });
      }
      return [
        {
          label: 'Combinations',
          link: combinationsQueryLink
        }
      ];
    }

    const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
      limit: 20
    });

    const poapsQuery = createCommonOwnersPOAPsQuery(address);

    const poapLink = createAppUrlWithQuery(poapsQuery, {
      limit: 20
    });

    const tokenSupplyLink = createAppUrlWithQuery(TokenTotalSupplyQuery, {
      tokenAddress: query
    });

    const poapSupplyLink = createAppUrlWithQuery(POAPSupplyQuery, {
      eventId: query
    });

    const options = activeTokenInfo
      ? []
      : [
          isPoap
            ? {
                label: 'POAP holders',
                link: poapLink
              }
            : {
                label: 'Token holders',
                link: tokenLink
              }
        ];

    if (!activeTokenInfo) {
      options.push({
        label: isPoap ? 'POAP supply' : 'Token supply',
        link: isPoap ? poapSupplyLink : tokenSupplyLink
      });
    }

    if (activeTokenInfo) {
      const erc6551AccountsQueryLink = createAppUrlWithQuery(
        erc6551TokensQuery,
        {
          tokenAddress: token.tokenAddress,
          blockchain: token.blockchain,
          tokenId: token.tokenId
        }
      );

      const poapDetailsQueryLink = createAppUrlWithQuery(poapDetailsQuery, {
        tokenAddress: token.tokenAddress,
        eventId: token.eventId
      });

      const tokenDetailsQueryLink = createAppUrlWithQuery(tokenDetailsQuery, {
        tokenAddress: token.tokenAddress,
        blockchain: token.blockchain,
        tokenId: token.tokenId
      });

      const erc20DetailsQueryLink = createAppUrlWithQuery(
        erc20TokenDetailsQuery,
        {
          tokenAddress: token.tokenAddress,
          blockchain: token.blockchain,
          tokenId: token.tokenId
        }
      );

      options.push({
        label: token?.eventId ? 'POAP Details' : 'Token Details',
        link: token?.eventId
          ? poapDetailsQueryLink
          : token?.tokenId
          ? tokenDetailsQueryLink
          : erc20DetailsQueryLink
      });

      options.push({
        label: 'ERC6551 Accounts',
        link: erc6551AccountsQueryLink
      });
    }

    return options;
  }, [
    activeTokenInfo,
    activeView,
    address,
    isPoap,
    query,
    token.blockchain,
    token.eventId,
    token.tokenAddress,
    token.tokenId,
    tokenFilters,
    tokenOwnersQuery,
    tokensQueryWithFilter
  ]);

  const hasMulitpleERC20 = useMemo(() => {
    const erc20Tokens = overviewTokens.filter(
      (token: TokenAndHolder) => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [overviewTokens]);

  const handleInvalidAddress = useCallback(() => {
    setShowTokensOrOverview(false);
  }, []);

  const showInCenter = isHome;

  const showTokens =
    showTokensOrOverview && !hasMulitpleERC20 && !activeTokenInfo;

  return (
    <Layout>
      <div
        className={classNames(
          'flex flex-col px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-8',
          {
            'flex-1 h-full w-full flex flex-col items-center !pt-[30%] text-center':
              showInCenter
          }
        )}
      >
        <div className="flex flex-col items-center">
          {showInCenter && (
            <h1 className="text-[2rem]">Explore web3 identities</h1>
          )}
          <Search />
        </div>
        {query && query.length > 0 && (
          <>
            {!hasMulitpleERC20 && (
              <div className="hidden sm:flex-col-center my-3">
                <GetAPIDropdown options={options} />
              </div>
            )}
            <div className="flex flex-col justify-center mt-7" key={query}>
              <HoldersOverview onAddress404={handleInvalidAddress} />
              {showTokens && (
                <>
                  {activeView && <OverviewDetails />}
                  {!activeView && (
                    <div key={tokenListKey}>
                      <div className="flex mb-4">
                        <Icon name="token-holders" height={20} width={20} />{' '}
                        <span className="font-bold ml-1.5 text-sm">
                          Holders
                        </span>
                      </div>
                      <Tokens />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
