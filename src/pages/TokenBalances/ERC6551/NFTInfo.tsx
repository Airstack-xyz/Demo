import { useEffect, useMemo, useState } from 'react';
import { CopyButton as CopyBtn } from '../../../Components/CopyButton';
import { KeyValue } from './KeyValue';
import { Attribute, Nft, TokenTransfer } from '../erc20-types';
import { ERC20TokenDetailsResponse } from './types';
import { Link, useNavigate } from 'react-router-dom';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import classNames from 'classnames';
import { AddressesModal } from '../../../Components/AddressesModal';

function CopyButton({ value }: { value: string }) {
  return (
    <span className="ml-0.5">
      <CopyBtn value={value} />
    </span>
  );
}

const minOwners = 3;
const maxOwners = 7;
function Owners({ tokens }: { tokens: Nft['tokenBalances'] }) {
  const [showModal, setShowModal] = useState(false);
  const [showMax, setShowMax] = useState(false);
  const navigator = useNavigate();
  const items = useMemo(() => {
    if (!showMax) {
      return tokens?.slice(0, minOwners);
    }
    return tokens.slice(0, maxOwners);
  }, [showMax, tokens]);

  const modalValues = useMemo(() => {
    const leftValues: string[] = [];
    const rightValues: string[] = [];
    if (!showMax) return { leftValues, rightValues };
    tokens.forEach((token, index) => {
      if (index % 2 === 0) {
        leftValues.push(token?.owner?.identity);
      } else {
        rightValues.push(token?.owner?.identity);
      }
    });
    return {
      leftValues,
      rightValues
    };
  }, [showMax, tokens]);

  return (
    <>
      <ul className="text-text-secondary overflow-hidden flex flex-col justify-center mr-1">
        {items?.map((token, index) => (
          <li key={index} className={classNames('mb-2.5 last:mb-0 flex')}>
            <Link
              className="ellipsis border border-solid border-transparent hover:border-solid-stroke hover:bg-glass rounded-18"
              to={createTokenBalancesUrl({
                address: token?.owner?.identity,
                blockchain: '',
                inputType: 'ADDRESS'
              })}
            >
              {token?.owner?.identity}
            </Link>{' '}
            <CopyButton value={token?.owner?.identity} />
          </li>
        ))}

        {!showMax && tokens?.length > minOwners && (
          <li
            onClick={() => {
              setShowMax(show => !show);
            }}
            className="text-text-button font-bold cursor-pointer"
          >
            see more
          </li>
        )}
        {showMax && tokens.length > maxOwners && (
          <li
            onClick={() => {
              if (showMax && tokens.length > maxOwners) {
                setShowModal(true);
              }
            }}
            className="text-text-button font-bold cursor-pointer"
          >
            see all
          </li>
        )}
      </ul>
      <AddressesModal
        heading="All Holders"
        modalValues={modalValues}
        isOpen={showModal}
        onAddressClick={(address: string) => {
          navigator(
            createTokenBalancesUrl({
              address,
              blockchain: '',
              inputType: 'ADDRESS'
            })
          );
        }}
        onRequestClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}

export function NFTInfo({
  nft,
  transfterDetails
}: {
  nft: Nft;
  transfterDetails: TokenTransfer;
}) {
  const [showContactDetails, setShowContactDetails] = useState(false);

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
        <KeyValue
          name="Token Address"
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
          value={<Owners tokens={nft?.tokenBalances || []} />}
        />
        {!expandDetails && <KeyValue name="Assets included" value="--" />}
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
              value={transfterDetails?.tokenAddress || '--'}
            />
            <KeyValue
              name="Total supply"
              value={nft?.token?.totalSupply || '--'}
            />
            <KeyValue
              name="Last transfer time"
              value={transfterDetails?.blockTimestamp}
            />
            <KeyValue
              name="Last transfer block"
              value={transfterDetails?.blockNumber}
            />
            <KeyValue
              name="Last transfer hash"
              value={
                <>
                  <span className="ellipsis">
                    {transfterDetails?.transactionHash}
                  </span>
                  {transfterDetails?.transactionHash && (
                    <CopyButton value={transfterDetails?.transactionHash} />
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
