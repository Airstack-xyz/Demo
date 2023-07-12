import { Asset, useLazyQueryWithPagination } from '@airstack/airstack-react';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { tokenOwnerQuery } from '../../queries';
import { useSearchInput } from '../../hooks/useSearchInput';
import { TokenBalance } from '../TokenBalances/types';
import { getDAppType } from './utils';
import { Chain } from '@airstack/airstack-react/constants';

function Header() {
  return (
    <thead className="glass-effect">
      <tr className="[&>th]:text-sm [&>th]:font-bold [&>th]:text-left [&>th]:py-5">
        <th className="pl-9">Token Image</th>
        <th>Wallet address</th>
        <th>Token ID</th>
        <th>Primary ENS</th>
        <th>ENS</th>
        <th>Lens</th>
        <th>Farcaster</th>
        <th className=" pr-9">XMTP </th>
      </tr>
    </thead>
  );
}

export function Token({ token }: { token: TokenBalance | null }) {
  const walletAddress = '';
  const tokenId = token?.tokenId || '';
  const tokenAddress = token?.tokenAddress || '';
  const primarEns = token?.owner?.primaryDomain?.name || '';
  const ens = token?.owner?.domains?.map(domain => domain.name) || [];

  const { lens, farcaster } = useMemo(() => {
    const social = token?.owner?.socials || [];
    const result = { lens: [], farcaster: [] };
    social.forEach(({ dappSlug, profileName }) => {
      const type = getDAppType(dappSlug);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const list = result[type];
      if (list) {
        list.push(profileName);
      }
    });
    return result;
  }, [token]);

  return (
    <>
      <td>
        <div className="token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden m-auto [&>div]:w-full [&>div>img]:w-full">
          {tokenAddress && tokenId && (
            <Asset
              address={tokenAddress}
              tokenId={tokenId}
              preset="small"
              containerClassName="token-img"
              error={<></>}
              chain={token?.blockchain as Chain}
            />
          )}
        </div>
      </td>
      <td>{walletAddress || '--'}</td>
      <td>#{tokenId || '--'}</td>
      <td>{primarEns || '--'}</td>
      <td>
        <ul>
          {ens.map((name, index) => (
            <li key={index} className="ellipsis mb-1">
              {name}
            </li>
          ))}
          {ens.length === 0 && <li>--</li>}
        </ul>
      </td>
      <td>
        <ul>
          {lens.map((name, index) => (
            <li key={index} className="ellipsis mb-1">
              {name}
            </li>
          ))}
          {lens.length === 0 && <li>--</li>}
        </ul>
      </td>
      <td>
        <ul>
          {farcaster.map((name, index) => (
            <li key={index} className="ellipsis mb-1">
              {name}
            </li>
          ))}
          {farcaster.length === 0 && <li>--</li>}
        </ul>
      </td>
      <td>@</td>
    </>
  );
}

const loaderData = Array(6).fill({});

export function Tokens() {
  const [fetch, { data, loading }] =
    useLazyQueryWithPagination(tokenOwnerQuery);

  const { query: tokenAddress } = useSearchInput();

  useEffect(() => {
    if (tokenAddress) {
      fetch({
        tokenAddress,
        limit: 200
      });
    }
  }, [fetch, tokenAddress]);

  const tokens = useMemo(() => {
    if (!data) return [];

    const ethTokenBalances: TokenBalance[] = data.ethereum?.TokenBalance;
    const polygonTokenBalances: TokenBalance[] = data.polygon?.TokenBalance;
    return [...ethTokenBalances, ...polygonTokenBalances];
  }, [data]);

  const items: TokenBalance[] = loading ? loaderData : tokens;

  return (
    <div className="w-full border border-solid border-stroke-color rounded-lg sm:overflow-hidden pb-5 overflow-y-auto">
      <table className="w-full text-xs table-fixed">
        {!loading && <Header />}
        {/* <tr
          className={classNames(
            '[&>td]:p-2 [&>td]:align-middle  min-h-[54px] hover:bg-secondary',
            {
              'skeleton-loader': loading
            }
          )}
          data-loader-type="block"
          data-loader-margin="10"
        >
          <Token token={null} />
        </tr> */}
        <tbody>
          {items.map((token, index) => (
            <tr
              key={index}
              className={classNames(
                '[&>td]:p-2 [&>td]:align-middle  min-h-[54px] hover:bg-secondary',
                {
                  'skeleton-loader': loading
                }
              )}
              data-loader-type="block"
              data-loader-margin="10"
            >
              <Token token={token} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
