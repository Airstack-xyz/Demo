import { useQuery } from '@airstack/airstack-react';
import { Icon } from '../../../Components/Icon';
import { Token } from '../Token';
import { erc6551DetailsQuery } from '../../../queries/erc6551-details';
import { ERC20Response, Nft } from '../erc20-types';
import { Children } from './Children';

const infoOptions: {
  name: string;
  dataKey: string;
}[] = [
  {
    name: 'Contract',
    dataKey: 'contract'
  },
  {
    name: 'Holder',
    dataKey: 'holder'
  },
  {
    name: 'Assets included',
    dataKey: 'assetsIncluded'
  },
  {
    name: 'Traits',
    dataKey: 'tokenTraits'
  },
  {
    name: 'Last transfer time',
    dataKey: 'lastTransferTimestamp'
  },
  {
    name: 'Last transfer block',
    dataKey: 'lastTransferBlock'
  },
  {
    name: 'Last transfer hash',
    dataKey: 'lastTransferHash'
  },
  {
    name: 'Token URI',
    dataKey: 'tokenURI'
  }
];

function formatData(data: ERC20Response) {
  if (!data) return {};
  return {
    nft: data.Accounts.Account[0].nft,
    childNft: data.Accounts.Account[0].address
  };
}

export function ERC6551Details() {
  const { data } = useQuery(
    erc6551DetailsQuery,
    {
      blockchain: 'polygon',
      tokenAddress: '0x99d3fd2f1cf2e99c43f95083b98033d191f4eabb',
      tokenId: '10'
    },
    { dataFormatter: formatData }
  );

  // eslint-disable-next-line no-console
  console.log('data', data);

  const nft: Nft = data?.nft || {};

  function getValueFromKey(key: string) {
    switch (key) {
      case 'holder':
        return nft?.token?.owner.identity;
      case 'tokenTraits':
        return nft?.token?.tokenTraits || '--';
    }
    return '--';
  }

  return (
    <div>
      <div className="bg-glass border-solid-stroke rounded-18 flex p-5">
        <div className="mr-7">
          <Token token={data?.nft} />
          <button className="py-10 px-10 mt-7">
            <Icon name="token-holders" />
            <span>View holders</span>
          </button>
        </div>
        <div className="text-sm">
          {infoOptions.map((option, index) => (
            <div className="flex mb-3" key={index}>
              <div className="w-32 mr-2">{option.name}</div>
              <div className="text-text-secondary">
                {nft
                  ? nft[option.dataKey as keyof Nft] ||
                    getValueFromKey(option.dataKey)
                  : '--'}
              </div>
            </div>
          ))}
          <div className="flex mb-3">
            <div className="w-32 mr-2">Contract</div>
            <div className="text-text-secondary">--</div>
          </div>
        </div>
      </div>
      <Children />
    </div>
  );
}
