import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect, useMemo } from 'react';
import { ERC20TokensQuery } from '../../queries';
import { SectionHeader } from './SectionHeader';
import { ERC20TokensType, TokenBalance } from './types';
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
function Token({
  amount,
  symbol,
  type
}: {
  type: string;
  symbol: string;
  amount: number;
}) {
  return (
    <div className="flex mb-5">
      <div className="h-10 w-10 rounded-full overflow-hidden">
        <img src="images/temp-poap.png" className="h-full" />
      </div>
      <div className="flex flex-1 items-center min-w-0 text-sm pl-2.5">
        <span className="ellipsis w-14">{amount}</span>
        <span className="mx-1.5 ellipsis flex-1">{symbol}</span>
        <span className="text-xs text-text-secondary">{type}</span>
      </div>
    </div>
  );
}

const loaderData = Array(3).fill({ poapEvent: {} });

export function ERC20Tokens() {
  const [tokens, setTokens] = useState<{
    ethereum: TokenBalance[];
    polygon: TokenBalance[];
  }>({
    ethereum: [],
    polygon: []
  });

  const [fetch, { data: _data, loading }] =
    useLazyQueryWithPagination(ERC20TokensQuery);
  const { query: owner } = useSearchInput();

  const data = _data as ERC20TokensType;

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 5
      });
      setTokens({
        ethereum: [],
        polygon: []
      });
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      setTokens(existingTokens => ({
        ethereum: [...existingTokens.ethereum, ...data.ethereum.TokenBalance],
        polygon: [...existingTokens.polygon, ...data.polygon.TokenBalance]
      }));
    }
  }, [data]);

  // const handleNext = useCallback(() => {
  //   pagination?.getNextPage();
  // }, [pagination]);

  // const dataNotFound = !error && !loading && poaps.length === 0;

  const items = useMemo((): TokenBalance[] => {
    return loading ? loaderData : [...tokens.ethereum, ...tokens.polygon];
  }, [loading, tokens.ethereum, tokens.polygon]);

  return (
    <div className="mt-11">
      <div className="hidden sm:block">
        <SectionHeader iconName="poap-flat" heading="POAPs" />
      </div>
      <div
        className={classNames(
          'mt-3.5 glass-effect p-5 rounded-lg border border-solid border-stroke-color',
          {
            'skeleton-loader': loading
          }
        )}
        data-loader-type="block"
        data-loader-height="auto"
      >
        {items.map((token, index) => (
          <div>
            <Token
              key={index}
              amount={token?.formattedAmount}
              symbol={token?.token?.symbol}
              type={token?.token?.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
