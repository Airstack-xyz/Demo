import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../Components/Icon';
import { formatDate } from '../../utils';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { PoapsType, TokenType as TokenType } from './types';
import { Asset } from '../../Components/Asset';
import classNames from 'classnames';
import { Nft } from './erc20-types';

type Poap = PoapsType['Poaps']['Poap'][0];

type TokenProps = {
  token: null | TokenType | Poap | Nft;
};

function FolderOverLay() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="288"
      height="128"
      viewBox="0 0 288 128"
      fill="none"
    >
      <defs>
        <filter
          id="filter0_b_1224_923"
          x="-100"
          y="-100"
          width="487.975"
          height="328"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="50" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1224_923"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_1224_923"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1224_923"
          x1="-25.0254"
          y1="-11.4682"
          x2="351.135"
          y2="273.486"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" stop-opacity="0.4" />
          <stop offset="1" stop-color="white" stop-opacity="1" />
        </linearGradient>
      </defs>
      <g filter="url(#filter0_b_1224_923)">
        <path
          d="M0 17.4C0 7.79025 7.79025 0 17.4 0H64.733C67.8375 0 70.8854 0.830568 73.5607 2.40556L111.889 24.9702C114.564 26.5452 117.612 27.3757 120.716 27.3757H270.575C280.184 27.3757 287.975 35.166 287.975 44.7757V110.6C287.975 120.21 280.184 128 270.575 128H17.4C7.79023 128 0 120.21 0 110.6L0 17.4Z"
          fill="url(#paint0_linear_1224_923)"
          fill-opacity="0.2"
        />
      </g>
    </svg>
  );
}

export const TokenWithERC6551 = memo(function Token({
  token: tokenProp
}: TokenProps) {
  const token = (tokenProp || {}) as TokenType;
  const poap = (tokenProp || {}) as Poap;
  const isPoap = Boolean(poap.poapEvent);
  const poapEvent = poap.poapEvent || {};
  const city = poapEvent.city || '';

  const address = token.tokenAddress || poap.tokenAddress;
  const tokenId =
    (tokenProp as Nft)?.tokenId || token?.tokenNfts?.tokenId || poap.tokenId;
  const ids = useMemo(() => {
    if (isPoap) return [poapEvent?.eventName];
    return [tokenId, token?._tokenId].filter(Boolean);
  }, [isPoap, poapEvent?.eventName, token?._tokenId, tokenId]);

  const symbol = token?.token?.symbol || '';
  const type = token?.tokenType || 'POAP';
  const blockchain = token.blockchain || 'ethereum';
  const name = isPoap
    ? `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`
    : token?.token?.name;

  const image = isPoap ? poapEvent?.logo?.image?.medium : '';
  const eventId = poapEvent?.eventId || '';
  const tokenName = isPoap ? poapEvent?.eventName : token?.token?.name;

  const erc6551Accounts = token.tokenNfts?.erc6551Accounts;

  const nestedTokens = useMemo(() => {
    if (!erc6551Accounts || erc6551Accounts?.length === 0) {
      return [] as TokenType[];
    }

    return erc6551Accounts.reduce((tokens: TokenType[], token) => {
      if (token?.address?.tokenBalances) {
        return [...tokens, ...token.address.tokenBalances];
      }
      return tokens;
    }, []);
  }, [erc6551Accounts]);

  const assets = useMemo(() => {
    if (!address || !tokenId) return null;
    const assets = [
      {
        image,
        address: address,
        tokenId: tokenId,
        chain: blockchain
      }
    ];

    nestedTokens.forEach(token => {
      if (assets.length < 3) {
        assets.push({
          image: '',
          address: token.tokenAddress,
          tokenId: token.tokenNfts?.tokenId,
          chain: token.blockchain
        });
      }
    });
    return assets.map((asset, index) => (
      <div
        key={index}
        className="w-[173px] h-[173px] absolute rounded-18 overflow-hidden shadow-md bg-tertiary"
        style={{ rotate: `${index * 10}deg`, zIndex: assets.length - index }}
      >
        <Asset
          image={asset.image}
          address={asset.address}
          tokenId={asset.tokenId}
          chain={asset.chain}
          preset="medium"
          containerClassName="w-full h-full"
        />
      </div>
    ));
  }, [address, blockchain, image, nestedTokens, tokenId]);

  return (
    <Link
      className="h-[300px] w-[300px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token"
      data-loader-type="block"
      to={createTokenHolderUrl({
        address: isPoap && eventId ? eventId : address,
        inputType: type === 'POAP' ? 'POAP' : 'ADDRESS',
        type,
        blockchain,
        label: tokenName || '--'
      })}
      style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.30)' }}
    >
      {address && tokenId && (
        <div className="absolute blur-md inset-0">
          <Asset
            image={image}
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            preset="medium"
            containerClassName="w-full h-full [&>img]:w-full [&>img]:min-w-full"
          />
        </div>
      )}
      <div className="absolute inset-0 [&>div]:w-[173px] [&>div]:h-[173px] [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
        {assets}
      </div>
      <div className="flex justify-between z-10">
        <button className="text-sm bg-white rounded-18 text-primary flex py-2 px-3 items-center">
          <Icon width={16} name="token-holders" />
          <span className="ml-1.5">Holders</span>
        </button>
        <div className="flex">
          <div className="rounded-full h-9 w-9 bg-glass border-solid-light">
            <Icon name={blockchain} className="w-full" />
          </div>
          <div className="h-9 rounded-3xl ml-2.5 border-solid-light flex justify-center items-center px-2 bg-glass">
            {type}
          </div>
        </div>
      </div>

      <div className="h-20 rounded-3xl px-3 py-2.5 z-10">
        <div className="flex flex-col text-sm z-10">
          <div>+{nestedTokens.length} assets</div>
          <div className="ellipsis text-xs font-semibold my-1.5">
            {name || '--'}
          </div>
          <div className="flex items-center justify-between">
            <div className="ellipsis flex flex-1 mr-2">
              {ids.map((id, index) => (
                <>
                  <span
                    key={id}
                    className={classNames('ellipsis', {
                      'max-w-[50%]': ids.length > 1
                    })}
                  >
                    {!isPoap && '#'}
                    {id}
                  </span>
                  {index < ids.length - 1 && <span className="mr-1">,</span>}
                </>
              ))}
            </div>
            <div className="ellipsis text-right max-w-[50%]">
              {symbol || ''}
            </div>
          </div>
        </div>
        {erc6551Accounts?.length > 0 && (
          <div className="absolute bottom-0 z-0 w-full left-0 flex justify-center">
            <FolderOverLay />
          </div>
        )}
      </div>
    </Link>
  );
});
