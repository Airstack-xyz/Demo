import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/Layout';
import { Tokens } from './Tokens/Tokens';
import { HoldersOverview } from './Overview/Overview';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { SocialQuery, TokenTotalSupplyQuery } from '../../queries';
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
  TokenHolder
} from '../../store/tokenHoldersOverview';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import {
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery,
  erc20TokenDetailsQuery
} from '../../queries/tokenDetails';
import { useTokenDetails } from '../../store/tokenDetails';

export function TokenHolders() {
  const [
    { address: tokenAddress, activeView, tokenFilters, activeTokenInfo },
    setData
  ] = useSearchInput();
  const [{ hasERC6551, owner }] = useTokenDetails(['hasERC6551', 'owner']);
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);
  const [showTokensOrOverview, setShowTokensOrOverview] = useState(true);

  const addressRef = useRef<null | string[]>(null);
  const isHome = useMatch('/');

  const query = tokenAddress.length > 0 ? tokenAddress[0] : '';

  useEffect(() => {
    setShowTokensOrOverview(true);
  }, [tokenAddress]);

  const tokenKey = useMemo(() => tokenAddress.join(','), [tokenAddress]);

  useEffect(() => {
    // go to token-holders page if user input address has changed
    if (addressRef.current && addressRef.current !== tokenAddress) {
      setData(
        {
          activeView: '',
          activeTokenInfo: ''
        },
        {
          updateQueryParams: true
        }
      );
    }
    addressRef.current = tokenAddress;
  }, [tokenAddress, setData]);

  const hasSomePoap = tokenAddress.some(token => !token.startsWith('0x'));
  const hasPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const address = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const tokenOwnersQuery = useMemo(() => {
    if (address.length === 0) return '';
    if (address.length === 1) {
      return getNftOwnersQuery(address[0].address);
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    return getCommonNftOwnersQuery(address[0], address[1]);
  }, [address, hasSomePoap]);

  const tokensQueryWithFilter = useMemo(() => {
    const requestFilters = getRequestFilters(tokenFilters);
    const _hasSocialFilters = Boolean(requestFilters?.socialFilters);
    const _hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
    if (address.length === 0) return '';
    if (address.length === 1) {
      return getNftOwnersQueryWithFilters(
        address[0].address,
        _hasSocialFilters,
        _hasPrimaryDomain
      );
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQueryWithFilters(
        tokens[0],
        tokens[1],
        _hasSocialFilters,
        _hasPrimaryDomain
      );
    }
    return getCommonNftOwnersQueryWithFilters(
      address[0],
      address[1],
      _hasSocialFilters,
      _hasPrimaryDomain
    );
  }, [tokenFilters, address, hasSomePoap]);

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
      const _hasSocialFilters = Boolean(requestFilters?.socialFilters);
      const _hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
      let combinationsQueryLink = '';
      if (hasPoap) {
        const combinationsQuery = getFilterablePoapsQuery(
          address,
          _hasSocialFilters,
          _hasPrimaryDomain
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

    const options = [];

    if (!activeTokenInfo && !hasERC6551) {
      if (hasPoap) {
        const poapsQuery = createCommonOwnersPOAPsQuery(address);

        const poapLink = createAppUrlWithQuery(poapsQuery, {
          limit: 20
        });

        const poapSupplyLink = createAppUrlWithQuery(POAPSupplyQuery, {
          eventId: query
        });

        options.push({
          label: 'POAP holders',
          link: poapLink
        });

        options.push({
          label: 'POAP supply',
          link: poapSupplyLink
        });
      } else {
        const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
          limit: 20
        });

        options.push({
          label: 'Token holders',
          link: tokenLink
        });

        const tokenSupplyLink = createAppUrlWithQuery(TokenTotalSupplyQuery, {
          tokenAddress: query
        });

        options.push({
          label: 'Token supply',
          link: tokenSupplyLink
        });
      }
    }

    if (hasERC6551 && !activeTokenInfo) {
      const socialLink = createAppUrlWithQuery(SocialQuery, {
        identity: owner
      });
      options.push({
        label: 'Socials, Domains & XMTP',
        link: socialLink
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

      if (token?.eventId) {
        options.push({
          label: 'POAP Details',
          link: poapDetailsQueryLink
        });
      } else {
        options.push({
          label: 'Token Details',
          link: token?.tokenId ? tokenDetailsQueryLink : erc20DetailsQueryLink
        });
      }

      if (hasERC6551) {
        options.push({
          label: 'ERC6551 Accounts',
          link: erc6551AccountsQueryLink
        });
      }
    }

    return options;
  }, [
    address,
    activeView,
    activeTokenInfo,
    hasERC6551,
    tokenFilters,
    hasPoap,
    tokenOwnersQuery,
    tokensQueryWithFilter,
    query,
    owner,
    token.tokenAddress,
    token.blockchain,
    token.tokenId,
    token.eventId
  ]);

  const hasMultipleERC20 = useMemo(() => {
    const erc20Tokens = overviewTokens.filter(
      (token: TokenHolder) => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [overviewTokens]);

  const handleInvalidAddress = useCallback(() => {
    setShowTokensOrOverview(false);
  }, []);

  const showInCenter = isHome;

  const showTokens =
    showTokensOrOverview && !hasMultipleERC20 && !activeTokenInfo;

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
            {!hasMultipleERC20 && (
              <div className="m-3 flex-row-center">
                <div className="flex justify-between w-[calc(100vw-20px)] sm:w-[645px]">
                  <div className="flex-row-center gap-1">
                    {/* <SnapshotFilter disabled={hasSomePoap} /> */}
                  </div>
                  <GetAPIDropdown
                    options={options}
                    disabled={overviewTokens.length === 0}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col justify-center mt-7" key={query}>
              <HoldersOverview onAddress404={handleInvalidAddress} />
              {showTokens && (
                <>
                  {activeView && <OverviewDetails />}
                  {!activeView && (
                    <div key={tokenKey}>
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
