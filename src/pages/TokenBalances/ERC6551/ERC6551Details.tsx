import { useQuery } from '@airstack/airstack-react';
import { Icon } from '../../../Components/Icon';
import { Token } from '../Token';
import { erc6551DetailsQuery } from '../../../queries/erc6551-details';
import { ERC20Response, Nft, TokenTransfer } from '../erc20-types';
import { Children } from './Children';
import { CopyButton } from '../../../Components/CopyButton';
import { ReactNode, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { useSearchInput } from '../../../hooks/useSearchInput';

const infoOptions: {
  name: string;
  dataKey: string;
  canCopy?: boolean;
}[] = [
  {
    name: 'Contract',
    dataKey: 'contract',
    canCopy: true
  },
  {
    name: 'Holder',
    dataKey: 'holder',
    canCopy: true
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
    dataKey: 'lastTransferHash',
    canCopy: true
  },
  {
    name: 'Token URI',
    dataKey: 'tokenURI',
    canCopy: true
  }
];

function formatData(data: ERC20Response) {
  if (!data) return {};
  return {
    nft: data?.nft,
    transferDetails: data?.transfers?.TokenTransfer[0]
  };
}

function KeyValue({ name, value }: { name: string; value: ReactNode }) {
  return (
    <div className="flex overflow-hidden ellipsis mt-3">
      <div className="w-[140px]">{name}</div>
      <div className="text-text-secondary flex flex-1 ellipsis">{value}</div>
    </div>
  );
}

export function ERC6551Details() {
  const [{ address }] = useSearchInput();
  const isTokenBalances = !!useMatch('/token-balances');

  const [showContactDetails, setShowContactDetails] = useState(false);
  const { data } = useQuery(
    erc6551DetailsQuery,
    {
      blockchain: 'ethereum',
      tokenAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      tokenId: '6813'
    },
    { dataFormatter: formatData }
  );

  // eslint-disable-next-line no-console
  console.log('data', data);

  const nft: Nft = data?.nft || {};
  const transfterDetails: TokenTransfer = data?.transferDetails || {};

  function getValueFromKey(key: string): ReactNode {
    switch (key) {
      case 'holder':
        return nft?.token?.owner.identity;
      case 'tokenTraits':
        return (
          nft?.metaData?.attributes?.map(attribute => (
            <div key={attribute.trait_type}>
              {attribute.trait_type}: {attribute.value}
            </div>
          )) || '--'
        );
    }
    return '--';
  }

  return (
    <div className="max-w-[950px] text-sm">
      <div className="flex items-center mb-7">
        <div className="flex items-center w-[60%] sm:w-auto overflow-hidden mr-1">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            // onClick={handleGoBack}
          >
            <Icon
              name={isTokenBalances ? 'token-balances' : 'token-holders'}
              height={20}
              width={20}
            />{' '}
            <span className="ml-1.5 text-text-secondary break-all cursor-pointer max-w-[90%] sm:max-w-[500px] ellipsis">
              Token {isTokenBalances ? 'balances' : 'holders'} of {address}
            </span>
          </div>
          <span className="mr-2 text-text-secondary">/</span>
        </div>
        <div className="flex items-center flex-1">
          <Icon name="table-view" height={20} width={20} className="mr-1" />{' '}
          Details of {nft?.token?.name} (#{nft?.tokenId})
        </div>
      </div>
      <div className="bg-glass border-solid-stroke rounded-18 flex p-5">
        <div className="mr-7">
          <Token token={data?.nft} />
          <div className="flex justify-center">
            <button className="flex py-2 px-10 mt-7 bg-button-primary rounded-18">
              <Icon name="token-holders-white" />
              <span className="ml-1.5">View holders</span>
            </button>
          </div>
        </div>
        <div className="overflow-hidden text-sm">
          <div>
            {infoOptions.map(option => {
              const value: ReactNode = nft
                ? (nft[option.dataKey as keyof Nft] as string) ||
                  getValueFromKey(option.dataKey)
                : '--';
              return (
                <KeyValue
                  key={option.dataKey}
                  name={option.name}
                  value={
                    <>
                      <span className="ellipsis">{value}</span>
                      {option.canCopy && value && value !== '--' && (
                        <CopyButton value={value as string} />
                      )}
                    </>
                  }
                />
              );
            })}
          </div>
          <div className="overflow-hidden mt-3">
            {showContactDetails && (
              <div>
                <div className="my-3">Collection details</div>
                <div className="font-bold text-base">{nft?.token?.name}</div>
                <div className="text-text-secondary">
                  {nft?.metaData?.description || ' -- '}
                </div>
                <KeyValue name="Contract" value="--" />
                <KeyValue name="Total supply" value={nft?.token?.totalSupply} />
                <KeyValue
                  name="Last transfer time"
                  value={transfterDetails.blockTimestamp}
                />
                <KeyValue
                  name="Last transfer block"
                  value={transfterDetails.blockNumber}
                />
                <KeyValue
                  name="Last transfer hash"
                  value={
                    <>
                      <span className="ellipsis">
                        {transfterDetails.transactionHash}
                      </span>
                      {transfterDetails.transactionHash && (
                        <CopyButton value={transfterDetails.transactionHash} />
                      )}
                    </>
                  }
                />
              </div>
            )}
            {showContactDetails && <div className="mt-3"></div>}
            <button
              className="p-0 text-text-button font-bold"
              onClick={() => {
                setShowContactDetails(show => !show);
              }}
            >
              {showContactDetails ? 'Hide' : 'View'} contract info
            </button>
          </div>
        </div>
      </div>
      <Children />
    </div>
  );
}
