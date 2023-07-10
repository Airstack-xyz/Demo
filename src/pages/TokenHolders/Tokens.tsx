import classNames from 'classnames';
import { useState } from 'react';

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

export function Token() {
  return (
    <>
      <td>
        <div className="token-img-wrapper">
          {/* <Asset
            address={tokenAddress}
            tokenId={tokenId}
            preset="small"
            containerClassName="token-img"
            error={<Placeholder />}
            chain={blockchain}
          /> */}
        </div>
      </td>
      <td>0xA3...563</td>
      <td>#5806</td>
      <td>emperor.eth</td>
      <td>
        <ul>
          <li>emperor.eth</li>
          <li>emperor.eth</li>
          <li>see more</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>emperor.eth</li>
          <li>emperor.eth</li>
        </ul>
      </td>
      <td>emperor</td>
      <td>@</td>
    </>
  );
}

const loaderData = Array(6).fill({});

export function Tokens() {
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 3000);
  return (
    <div className="w-full border border-solid border-stroke-color rounded-lg overflow-hidden pb-5">
      <table className="w-full text-xs">
        {!loading && <Header />}
        <tr
          className={classNames(
            '[&>td]:p-2 [&>td]:align-middle  min-h-[54px] hover:bg-secondary',
            {
              'skeleton-loader': loading
            }
          )}
          data-loader-type="block"
          data-loader-margin="10"
        >
          <Token />
        </tr>
        <tbody>
          {loaderData.map((_, index) => (
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
              <Token />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
