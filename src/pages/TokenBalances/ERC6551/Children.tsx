import { useQuery } from '@airstack/airstack-react';
import { Token } from '../Token';
import { AccountsResponse } from './types';
import { getERC6551OfTokens } from '../../../queries/erc6551-details';
import { TokenType } from '../types';

function formatData(data: AccountsResponse) {
  if (!data) return {};
  return {
    accounts: data.Accounts.Account
  };
}
export function Children() {
  const { data } = useQuery(
    getERC6551OfTokens,
    {
      blockchain: 'polygon',
      tokenAddress: '0x99d3fd2f1cf2e99c43f95083b98033d191f4eabb',
      tokenId: '10'
    },
    { dataFormatter: formatData }
  );

  return (
    <div>
      <div className="tabs flex">
        <div>TAB1</div>
      </div>
      <div>
        <div>
          Contract details <button>View details</button>
        </div>
        <div>Details</div>
      </div>
      <div>
        <div>Asset</div>
        <div className="flex gap-x-10 gap-y-10">
          {data?.tokens?.map((token: TokenType) => {
            return <Token token={token} />;
          })}
        </div>
      </div>
    </div>
  );
}
