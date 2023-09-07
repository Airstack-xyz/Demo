import { ReactNode, useEffect, useState } from 'react';
import { CopyButton } from '../../../Components/CopyButton';
import { KeyValue } from './KeyValue';
import { Nft, TokenTransfer } from '../erc20-types';
import { ERC20TokenDetailsResponse } from './types';

const infoOptions: {
  name: string;
  dataKey: string;
  canCopy?: boolean;
}[] = [
  {
    name: 'Token Address',
    dataKey: 'address',
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

export function NFTInfo({
  nft,
  transfterDetails
}: {
  nft: Nft;
  transfterDetails: TokenTransfer;
}) {
  const [showContactDetails, setShowContactDetails] = useState(false);

  const isERC7251WithoutAccounts =
    nft?.type === 'ERC721' && nft?.erc6551Accounts?.length === 0;

  useEffect(() => {
    if (isERC7251WithoutAccounts) {
      setShowContactDetails(true);
    }
  }, [isERC7251WithoutAccounts]);

  function getValueFromKey(key: string): ReactNode {
    switch (key) {
      case 'holder':
        return nft?.tokenBalance?.owner?.identity;
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
    <div className="overflow-hidden text-sm">
      <div>
        {infoOptions.map(option => {
          if (isERC7251WithoutAccounts && option.dataKey === 'assetsIncluded') {
            return null;
          }

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
            <KeyValue name="Contract" value={transfterDetails.tokenAddress} />
            <KeyValue name="Total supply" value={nft?.totalSupply} />
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
  );
}

export function TokenERC20Info({
  token
}: {
  token?: ERC20TokenDetailsResponse['Token'];
}) {
  return (
    <div className="overflow-hidden text-sm">
      <KeyValue name="Token Address" value={token?.address} />
      <KeyValue name="Total supply" value={token?.totalSupply} />
      <KeyValue
        name="Last transfer time"
        value={token?.lastTransferTimestamp}
      />
      <KeyValue name="Last transfer block" value={token?.lastTransferBlock} />
      <KeyValue
        name="Last transfer hash"
        value={
          <>
            <span className="ellipsis">{token?.lastTransferHash}</span>
            {token?.lastTransferHash && (
              <CopyButton value={token?.lastTransferHash} />
            )}
          </>
        }
      />
    </div>
  );
}
