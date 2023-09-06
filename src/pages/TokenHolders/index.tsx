import React, { useEffect, useMemo, useRef } from 'react';
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
  TokenHolder
} from '../../store/tokenHoldersOverview';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import {
  getCommonNftOwnersSnapshotQuery,
  getNftOwnersSnapshotQuery
} from '../../queries/commonNftOwnersSnapshotQuery';
import {
  getCommonNftOwnersSnapshotQueryWithFilters,
  getNftOwnersSnapshotQueryWithFilters
} from '../../queries/commonNftOwnersSnapshotQueryWithFilters';

export function TokenHolders() {
  const [
    {
      address: tokenAddress,
      activeView,
      tokenFilters,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    },
    setData
  ] = useSearchInput();
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);

  const addressRef = useRef<null | string[]>(null);
  const isHome = useMatch('/');

  const query = tokenAddress.length > 0 ? tokenAddress[0] : '';

  const tokenListKey = useMemo(() => {
    return tokenAddress.join(',');
  }, [tokenAddress]);

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

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );
  const isCombination = tokenAddress.length > 1;
  const hasSomePoap = tokenAddress.some(token => !token.startsWith('0x'));
  const hasPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const address = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const tokenOwnersQuery = useMemo(() => {
    if (address.length === 0) return '';
    if (address.length === 1) {
      if (isSnapshotQuery) {
        return getNftOwnersSnapshotQuery({
          address: address[0].address,
          blockNumber: snapshotBlockNumber,
          date: snapshotDate,
          timestamp: snapshotTimestamp
        });
      }
      return getNftOwnersQuery(address[0].address);
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    if (isSnapshotQuery) {
      return getCommonNftOwnersSnapshotQuery({
        address1: address[0],
        address2: address[1],
        blockNumber: snapshotBlockNumber,
        date: snapshotDate,
        timestamp: snapshotTimestamp
      });
    }
    return getCommonNftOwnersQuery(address[0], address[1]);
  }, [
    address,
    hasSomePoap,
    isSnapshotQuery,
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
  ]);

  const tokensQueryWithFilter = useMemo(() => {
    const requestFilters = getRequestFilters(tokenFilters);
    const _hasSocialFilters = Boolean(requestFilters?.socialFilters);
    const _hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
    if (address.length === 0) return '';
    if (address.length === 1) {
      if (isSnapshotQuery) {
        return getNftOwnersSnapshotQueryWithFilters({
          address: address[0].address,
          blockNumber: snapshotBlockNumber,
          date: snapshotDate,
          timestamp: snapshotTimestamp,
          hasSocialFilters: _hasSocialFilters,
          hasPrimaryDomain: _hasPrimaryDomain
        });
      }
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
    if (isSnapshotQuery) {
      return getCommonNftOwnersSnapshotQueryWithFilters({
        address1: address[0],
        address2: address[1],
        blockNumber: snapshotBlockNumber,
        date: snapshotDate,
        timestamp: snapshotTimestamp,
        hasSocialFilters: _hasSocialFilters,
        hasPrimaryDomain: _hasPrimaryDomain
      });
    }
    return getCommonNftOwnersQueryWithFilters(
      address[0],
      address[1],
      _hasSocialFilters,
      _hasPrimaryDomain
    );
  }, [
    address,
    tokenFilters,
    hasSomePoap,
    isSnapshotQuery,
    snapshotDate,
    snapshotBlockNumber,
    snapshotTimestamp
  ]);

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
        if (isSnapshotQuery) {
          combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
            limit: 200,
            blockNumber: snapshotBlockNumber,
            date: snapshotDate,
            timestamp: snapshotTimestamp,
            ...requestFilters
          });
        } else {
          combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
            limit: 200,
            ...requestFilters
          });
        }
      }
      return [
        {
          label: 'Combinations',
          link: combinationsQueryLink
        }
      ];
    }

    const options = [];

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
      if (isSnapshotQuery) {
        const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
          limit: 20,
          blockNumber: snapshotBlockNumber,
          date: snapshotDate,
          timestamp: snapshotTimestamp
        });

        options.push({
          label: 'Token holders',
          link: tokenLink
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

    return options;
  }, [
    activeView,
    address,
    hasPoap,
    query,
    tokenFilters,
    tokenOwnersQuery,
    tokensQueryWithFilter,
    isSnapshotQuery,
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
  ]);

  const hasMultipleERC20 = useMemo(() => {
    const erc20Tokens = overviewTokens.filter(
      (token: TokenHolder) => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [overviewTokens]);

  const showInCenter = isHome;

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
                    {!hasSomePoap && !isCombination && <SnapshotFilter />}
                  </div>
                  <GetAPIDropdown
                    options={options}
                    disabled={overviewTokens.length === 0}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col justify-center mt-7" key={query}>
              {!isSnapshotQuery && <HoldersOverview />}
              {!hasMultipleERC20 && (
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
