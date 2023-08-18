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

export function TokenHolders() {
  const [{ address, tokenType, inputType, activeView, tokenFilters }, setData] =
    useSearchInput();
  const addressRef = useRef<null | string[]>(null);
  const isHome = useMatch('/');

  const query = address.length > 0 ? address[0] : '';

  useEffect(() => {
    // go to token-holders page if user input address has changed
    if (addressRef.current && addressRef.current !== address) {
      setData(
        {
          activeView: ''
        },
        {
          updateQueryParams: true
        }
      );
    }
    addressRef.current = address;
  }, [address, setData]);

  const hasSomePoap = address.some(token => !token.startsWith('0x'));
  const isPoap = address.every(token => !token.startsWith('0x'));

  const tokenOwnersQuery = useMemo(() => {
    if (address.length === 0) return '';
    if (address.length === 1) return getNftOwnersQuery(address[0]);
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    return getCommonNftOwnersQuery(address[0], address[1]);
  }, [hasSomePoap, address]);

  const tokensQueryWithFilter = useMemo(() => {
    const requestFilters = getRequestFilters(tokenFilters);
    if (address.length === 1)
      return getNftOwnersQueryWithFilters(
        address[0],
        Boolean(requestFilters?.socialFilters),
        requestFilters?.hasPrimaryDomain
      );
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQueryWithFilters(
        tokens[0],
        tokens[1],
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
      tokenAddress: query,
      limit: 20
    });
    const poapsQuery = createCommonOwnersPOAPsQuery(address);

    const poapLink = createAppUrlWithQuery(poapsQuery, {
      eventId: inputType === 'POAP' ? query : '123',
      limit: 20
    });

    const tokenSupplyLink = createAppUrlWithQuery(TokenTotalSupplyQuery, {
      tokenAddress: query
    });

    const poapSupplyLink = createAppUrlWithQuery(POAPSupplyQuery, {
      eventId: query
    });

    const options = [
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

    options.push({
      label: isPoap ? 'POAP supply' : 'Token supply',
      link: isPoap ? poapSupplyLink : tokenSupplyLink
    });

    return options;
  }, [
    activeView,
    address,
    inputType,
    isPoap,
    query,
    tokenFilters,
    tokenOwnersQuery,
    tokensQueryWithFilter
  ]);

  const isERC20 = tokenType === 'ERC20';
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
            <div className="hidden sm:flex-col-center my-3">
              <GetAPIDropdown options={options} />
            </div>
            {activeView && <OverviewDetails />}
            {!activeView && (
              <div className="flex flex-col justify-center mt-7" key={query}>
                {!isERC20 && <HoldersOverview />}
                <div
                  className={classNames({
                    'mt-7': !isERC20
                  })}
                >
                  <div className="flex mb-4">
                    <Icon name="token-holders" height={20} width={20} />{' '}
                    <span className="font-bold ml-1.5 text-sm">Holders</span>
                  </div>
                  <Tokens />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
