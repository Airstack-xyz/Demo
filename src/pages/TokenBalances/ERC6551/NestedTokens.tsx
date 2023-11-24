import { useQuery } from '@airstack/airstack-react';
import { Token } from '../Token';
import { AccountsResponse, TokenBalance } from './types';
import { erc6551TokensQuery } from '../../../queries/tokenDetails';
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../../Components/Icon';
import classNames from 'classnames';
import { Tokens } from '../Tokens';
import { useTokenDetails } from '../../../store/tokenDetails';

const loaderData = Array(3).fill({ token: {}, tokenNfts: {} });

function Loader() {
  return (
    <div className="flex flex-wrap">
      {loaderData.map((_, index) => (
        <div className="skeleton-loader" key={index}>
          <Token key={index} token={null} />
        </div>
      ))}
    </div>
  );
}

function formatData(data: AccountsResponse) {
  if (!data)
    return {
      accounts: []
    };
  return {
    accounts: data?.Accounts?.Account?.map(account => ({
      standard: account.standard,
      blockchain: account?.address?.blockchain,
      tokens: account?.address?.tokenBalances,
      identity: account?.address?.identity
    }))
  };
}

type Accounts = ReturnType<typeof formatData>['accounts'];

export function NestedTokens({
  tokenId,
  blockchain,
  tokenAddress
}: {
  tokenAddress: string;
  tokenId: string;
  blockchain: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const setDetails = useTokenDetails(['accountAddress'])[1];

  const { data, loading } = useQuery(
    erc6551TokensQuery,
    {
      blockchain,
      tokenAddress,
      tokenId
    },
    { dataFormatter: formatData }
  );

  const accounts: Accounts = data?.accounts || [];

  const account = data
    ? accounts[activeTab]
    : {
        standard: '',
        blockchain: '',
        tokens: [] as TokenBalance[],
        identity: ''
      };

  useEffect(() => {
    if (account.identity) {
      setDetails({
        accountAddress: account.identity
      });
    }
  }, [account.identity, setDetails]);

  const tokensProps = useMemo(() => {
    return {
      address: [account.identity],
      tokenType: '',
      blockchainType: [],
      sortOrder: 'DESC'
    };
  }, [account.identity]);

  return (
    <div className=" text-sm mt-5 px-2 sm:px-0">
      <div className="tabs flex my-5 border-b-[5px] border-solid border-secondary tabs">
        {accounts?.map((_, index) => (
          <div
            key={index}
            className={classNames(
              'flex w-[150px] items-center justify-center py-4 tab',
              {
                'active pointer-events-none': index === activeTab,
                'cursor-pointer hover:bg-tertiary': index !== activeTab
              }
            )}
            onClick={() => {
              setActiveTab(index);
              setShowDetails(false);
            }}
          >
            <Icon name="folder" /> <span className="ml-1">TBA{index + 1}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center">
          <span className="font-bold">Account details</span>{' '}
          <button
            className="text-text-button text-xs ml-2.5 flex items-center justify-center"
            onClick={() => {
              setShowDetails(show => !show);
            }}
          >
            {showDetails ? 'Hide details' : 'View details'}
            <span className={showDetails ? 'rotate-180' : ''}>
              <Icon name="arrow-down" />
            </span>
          </button>
        </div>
        {showDetails && (
          <div>
            <div className="flex my-3">
              <div className="min-w-[120px] mr-5">Account Address</div>
              <div className="text-text-secondary">
                {account.identity || '--'}
              </div>
            </div>
            <div className="flex my-3">
              <div className="min-w-[120px] mr-5">Token standard</div>
              <div className="text-text-secondary">
                {account.standard || '--'}
              </div>
            </div>
            <div className="flex my-3">
              <div className="min-w-[120px] mr-5">Chain</div>
              <div className="text-text-secondary">
                {account.blockchain || '--'}
              </div>
            </div>
          </div>
        )}
      </div>
      <div key={account?.identity}>
        <div className="font-bold my-5">Assets</div>
        <div className="[&>div>div]:!gap-x-6 [&>div>div]:!gap-y-6 [&>div>div]:justify-center sm:[&>div>div]:justify-start">
          {!loading && account.identity && (
            <Tokens
              {...tokensProps}
              blockchainType={[blockchain]}
              spamFilter="0"
              poapDisabled
              includeERC20
            />
          )}
          {loading && (
            <div>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
