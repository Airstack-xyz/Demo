import { useLazyQuery } from '@airstack/airstack-react';
import { Icon } from '../../../Components/Icon';
import { Token } from '../Token';
import {
  poapDetailsQuery,
  tokenDetailsQuery
} from '../../../queries/tokenDetails';
import { ERC20Response, Nft, TokenTransfer } from '../erc20-types';
import { NestedTokens } from './NestedTokens';
import { useEffect } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { PoapData } from './types';
import { PoapInfo } from './PoapInfo';
import { NFTInfo } from './NFTInfo';
import { createTokenHolderUrl } from '../../../utils/createTokenUrl';

function formatNFTData(data: ERC20Response) {
  if (!data) return {};
  return {
    nft: data?.nft,
    transferDetails: data?.transfers?.TokenTransfer[0]
  };
}

function formatPoapData(data: PoapData) {
  if (!data) return {};
  return {
    poap: data?.poap.Poap[0],
    transferDetails: data?.tokenTransfer.TokenTransfer[0]
  };
}

/* ERC 721 with 6551
{
      blockchain: 'ethereum',
      tokenAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      tokenId: '6813'
    },
  */

export function TokenDetails(props: {
  tokenAddress: string;
  tokenId: string;
  blockchain: string;
  eventId?: string;
  onClose?: () => void;
}) {
  const { tokenAddress, tokenId, blockchain, eventId, onClose } = props;
  const [{ address }] = useSearchInput();
  const isTokenBalances = !!useMatch('/token-balances');

  const [fetchToken, { data }] = useLazyQuery(
    tokenDetailsQuery,
    {
      tokenId,
      blockchain,
      tokenAddress
    },
    { dataFormatter: formatNFTData }
  );

  const nftData: ReturnType<typeof formatNFTData> = data;

  const [fetchPoap, { data: _poapData }] = useLazyQuery(
    poapDetailsQuery,
    {
      tokenAddress,
      eventId
    },
    { dataFormatter: formatPoapData }
  );

  const poapData: ReturnType<typeof formatPoapData> = _poapData;

  const isPoap = Boolean(eventId);
  const poap = poapData?.poap;

  useEffect(() => {
    // is poap
    if (isPoap) {
      fetchPoap();
    } else {
      fetchToken();
    }
  }, [fetchPoap, fetchToken, isPoap, tokenAddress]);

  const nft: Nft = nftData?.nft || ({} as Nft);
  const transfterDetails: TokenTransfer =
    nftData?.transferDetails || ({} as TokenTransfer);

  const hasChildren = !isPoap && nft?.erc6551Accounts?.length > 0;

  return (
    <div className="max-w-[950px] text-sm m-auto w-screen">
      <div className="flex items-center mb-7">
        <div className="flex items-center w-[60%] sm:w-auto overflow-hidden mr-1">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={() => {
              onClose?.();
            }}
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
          Details of {nft?.token?.name} (
          <span className="max-w-[100px] ellipsis">#{nft?.tokenId}</span>)
        </div>
      </div>
      <div className="bg-glass border-solid-stroke rounded-18 flex p-5">
        <div className="mr-7">
          <Token token={(poap || nft) as Nft} hideHoldersButton disabled />
          <div className="flex justify-center">
            <Link
              className="flex py-2 px-10 mt-7 bg-button-primary rounded-18"
              to={createTokenHolderUrl({
                address: (isPoap ? poap?.eventId : nft.address) as string,
                inputType: isPoap ? 'POAP' : 'ADDRESS',
                type: isPoap ? 'POAP' : nft.type,
                blockchain,
                label:
                  (isPoap ? poap?.poapEvent?.eventName : nft?.token?.name) ||
                  '--'
              })}
            >
              <Icon name="token-holders-white" />
              <span className="ml-1.5 font-medium">View holders</span>
            </Link>
          </div>
        </div>
        {isPoap && poap ? (
          <PoapInfo poap={poap} transfterDetails={poapData.transferDetails} />
        ) : (
          <NFTInfo nft={nft} transfterDetails={transfterDetails} />
        )}
      </div>
      {hasChildren && <NestedTokens {...props} />}
    </div>
  );
}
