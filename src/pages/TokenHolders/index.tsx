import React, { useMemo } from 'react';
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
import { Dropdown } from '../../Components/Dropdown';
import { Icon } from '../../Components/Icon';
import { OverviewDetails } from './OverviewDetails/OverviewDetails';

export function TokenHolders() {
  const [{ address: query, tokenType, inputType, activeView }] =
    useSearchInput();

  const options = useMemo(() => {
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

    const isPoap = inputType === 'POAP';

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

    if (!isPoap) {
      options.push({
        label: 'Token supply',
        link: tokenSupplyLink
      });
    }

    return options;
  }, [inputType, query]);

  const isERC20 = tokenType === 'ERC20';

  return (
    <Layout>
      <div className="flex flex-col px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-8">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        {query && (
          <>
            <div className="hidden sm:flex-col-center my-3">
              <Dropdown options={options} />
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
