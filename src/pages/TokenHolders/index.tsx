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

export function TokenHolders() {
  const { address: query, tokenType, inputType } = useSearchInput();

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
            <div className="flex flex-col justify-center mt-7" key={query}>
              {!isERC20 && <HoldersOverview />}
              <div
                className={classNames({
                  'mt-10': !isERC20
                })}
              >
                <Tokens />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
