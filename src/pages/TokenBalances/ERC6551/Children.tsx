import { useQuery } from '@airstack/airstack-react';
import { Token } from '../Token';
import { AccountsResponse, TokenBalance } from './types';
import { getERC6551OfTokens } from '../../../queries/erc6551-details';
import { useState } from 'react';
import { Icon } from '../../../Components/Icon';
import classNames from 'classnames';

function formatData(data: AccountsResponse) {
  if (!data)
    return {
      accounts: []
    };
  return {
    accounts: data.Accounts.Account.map(account => ({
      standard: account.standard,
      blockchain: account?.address?.blockchain,
      tokens: account?.address?.tokenBalances,
      identity: account?.address?.identity
    }))
  };
}

type Accounts = ReturnType<typeof formatData>['accounts'];

export function Children() {
  const [activeTab, setActiveTab] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const { data } = useQuery(
    getERC6551OfTokens,
    {
      blockchain: 'polygon',
      tokenAddress: '0x99d3fd2f1cf2e99c43f95083b98033d191f4eabb',
      tokenId: '10'
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

  return (
    <div className=" text-sm mt-5">
      <div className="tabs flex my-5 border-b-[5px] border-solid border-secondary tabs">
        {accounts?.map((_, index) => (
          <div
            key={index}
            className={classNames(
              'flex w-[150px] items-center justify-center py-4 tab',
              {
                active: index === activeTab,
                'cursor-pointer hover:bg-tertiary': index !== activeTab
              }
            )}
            onClick={() => {
              setActiveTab(index);
              setShowDetails(false);
            }}
          >
            <Icon name="stack" /> <span className="ml-1.5">TBA{index + 1}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center">
          <span className="font-bold">Contract details</span>{' '}
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
              <div className="min-w-[120px] mr-5">Contract</div>
              <div className="text-text-secondary">
                {account.identity || '--'} NOTE: this IS identity not contract
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
      <div>
        <div className="font-bold my-5">Asset</div>
        <div className="flex flex-wrap gap-x-6 gap-y-6">
          {account?.tokens?.map((token, index) => {
            return (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <Token key={`${token.tokenId}-${index}`} token={token as any} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
