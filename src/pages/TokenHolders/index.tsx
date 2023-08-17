import React, { useEffect, useMemo, useRef } from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { Tokens } from './Tokens/Tokens';
import { HoldersOverview } from './Overview/Overview';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import {
  PoapOwnerQuery,
  TokenOwnerQuery,
  TokenTotalSupplyQuery
} from '../../queries';
import classNames from 'classnames';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Icon } from '../../Components/Icon';
import { OverviewDetails } from './OverviewDetails/OverviewDetails';
import { getRequestFilters } from './OverviewDetails/Tokens/filters';
import {
  POAPSupplyQuery,
  getFilterableTokensQuery
} from '../../queries/overviewDetailsTokens';
import { getFilterablePoapsQuery } from '../../queries/overviewDetailsPoap';

export function TokenHolders() {
  const [{ address, tokenType, inputType, activeView, tokenFilters }, setData] =
    useSearchInput();
  const addressRef = useRef<null | string[]>(null);

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

  const options = useMemo(() => {
    const isPoap = inputType === 'POAP';
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
          eventId: query,
          limit: 200,
          ...requestFilters
        });
      } else {
        const combinationsQuery = getFilterableTokensQuery(
          address,
          Boolean(requestFilters?.socialFilters),
          requestFilters?.hasPrimaryDomain
        );
        combinationsQueryLink = createAppUrlWithQuery(combinationsQuery, {
          tokenAddress: query,
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

    const tokenLink = createAppUrlWithQuery(TokenOwnerQuery, {
      tokenAddress: query,
      limit: 20
    });

    const poapLink = createAppUrlWithQuery(PoapOwnerQuery, {
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
  }, [activeView, address, inputType, query, tokenFilters]);

  const isERC20 = tokenType === 'ERC20';
  const noQuery = !query;

  return (
    <Layout>
      <div
        className={classNames(
          'flex flex-col px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-8',
          {
            'flex-1 h-full w-full flex flex-col items-center !pt-[30%] text-center':
              noQuery
          }
        )}
      >
        <div className="flex flex-col items-center">
          {noQuery && <h1 className="text-[2rem]">Explore web3 identities</h1>}
          <Search />
        </div>
        {query && (
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
