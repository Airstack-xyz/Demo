import { useEffect, useMemo, useState } from 'react';
import { KeyValue } from '../KeyValue';
import { Attribute, Nft, TokenTransfer } from '../../ERC20/types';
import { ERC20TokenDetailsResponse } from '../types';
import { LoaderItem } from './LoaderItem';
import { CopyButton } from './CopyButton';
import { Owners } from './Owners';
import { useGetTokenHolders } from '../../../../hooks/useGetTokenHolders';

export function NFTInfo({
  nft,
  holderData,
  tokenId,
  blockchain,
  tokenAddress,
  loadingHolder,
  transferDetails
}: {
  tokenId: string;
  tokenAddress: string;
  blockchain: string;
  nft: Nft;
  holderData: {
    ownerAddress: string;
    hasParent: boolean;
  } | null;
  loadingHolder: boolean;
  transferDetails: TokenTransfer;
}) {
  const [showContactDetails, setShowContactDetails] = useState(false);

  const {
    fetchHolders,
    data: owners,
    loading
  } = useGetTokenHolders({
    tokenId,
    tokenAddress,
    blockchain,
    limit: 10
  });

  useEffect(() => {
    // Don't fetch tokenHolders data for gnosis blockchain (api doesn't support that)
    if (blockchain === 'gnosis') {
      return;
    }
    if (!loadingHolder || holderData) {
      fetchHolders();
    }
  }, [blockchain, fetchHolders, holderData, loadingHolder]);

  const expandDetails =
    nft?.type === 'ERC1155' ||
    (nft?.type === 'ERC721' && nft?.erc6551Accounts?.length === 0);

  useEffect(() => {
    if (expandDetails) {
      setShowContactDetails(true);
    }
  }, [expandDetails]);

  const attributes = nft?.metaData?.attributes;

  const traits = useMemo(() => {
    const _traits: Attribute[] = [];
    if (!attributes) return _traits;
    attributes.forEach(attribute => {
      if (attribute && attribute.trait_type) {
        _traits.push({
          trait_type: attribute.trait_type,
          value: attribute.value
        });
      }
    });
    return _traits;
  }, [attributes]);

  return (
    <div className="overflow-hidden text-sm">
      <div>
        <KeyValue name="Token name" value={nft?.token?.name} />
        <KeyValue name="Symbol" value={nft?.token?.symbol} />
        <KeyValue name="Token ID" value={nft?.tokenId} />
        <KeyValue
          name="Token address"
          value={
            <span className="ellipsis">
              <>
                <span className="ellipsis">{nft?.address}</span>{' '}
                <CopyButton value={nft?.address} />
              </>
            </span>
          }
        />
        <KeyValue
          name={`Holder${nft?.tokenBalances?.length > 1 ? 's' : ''}`}
          value={
            loading || loadingHolder ? (
              <LoaderItem />
            ) : (
              <Owners
                owners={
                  holderData?.ownerAddress
                    ? [holderData?.ownerAddress]
                    : owners || []
                }
                token={{
                  tokenId,
                  blockchain,
                  tokenAddress
                }}
              />
            )
          }
        />
        <KeyValue name="Token type" value={nft?.type} />
        <KeyValue name="Blockchain" value={nft?.blockchain} />
        {holderData && holderData.hasParent && (
          <KeyValue
            name="Parent 6551"
            value={
              <Owners
                owners={owners || []}
                token={{
                  tokenId,
                  blockchain,
                  tokenAddress
                }}
              />
            }
          />
        )}
        <KeyValue
          name="Traits"
          value={
            <span className="ellipsis">
              {traits.length > 0
                ? traits.map(attribute => (
                    <span className="flex" key={attribute.trait_type}>
                      {attribute.trait_type}: {attribute.value || '--'}
                    </span>
                  ))
                : '--'}
            </span>
          }
        />
        <KeyValue
          name="Last transfer time"
          value={nft?.lastTransferTimestamp}
        />
        <KeyValue name="Last transfer block" value={nft?.lastTransferBlock} />
        <KeyValue
          name="Last transfer hash"
          value={
            <>
              <span className="ellipsis">{nft?.lastTransferHash}</span>
              <CopyButton value={nft?.lastTransferHash || ''} />
            </>
          }
        />
        <KeyValue
          name="Token URI"
          value={
            <>
              <span className="ellipsis">{nft?.tokenURI}</span>
              <CopyButton value={nft?.tokenURI || ''} />
            </>
          }
        />
      </div>
      <div className="overflow-hidden mt-3">
        {showContactDetails && (
          <div>
            <div className="my-3">Collection details</div>
            <div className="font-bold text-base">{nft?.token?.name}</div>
            <div className="text-text-secondary">
              {nft?.metaData?.description || ' -- '}
            </div>
            <KeyValue
              name="Contract"
              value={transferDetails?.tokenAddress || '--'}
            />
            <KeyValue
              name="Total supply"
              value={nft?.token?.totalSupply || '--'}
            />
            <KeyValue
              name="Last transfer time"
              value={transferDetails?.blockTimestamp}
            />
            <KeyValue
              name="Last transfer block"
              value={transferDetails?.blockNumber}
            />
            <KeyValue
              name="Last transfer hash"
              value={
                <>
                  <span className="ellipsis">
                    {transferDetails?.transactionHash}
                  </span>
                  {transferDetails?.transactionHash && (
                    <CopyButton value={transferDetails?.transactionHash} />
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
