import { Chain } from '@airstack/airstack-react/constants';
import { IconType, Icon } from '../../../Components/Icon';
import { CopyButton } from '../ERC6551/NFTInfo/CopyButton';
import { RecommendedUser } from './types';
import { Asset } from '../../../Components/Asset';
import { ListWithViewMore } from './ListWithViewMore';
import { pluralize } from '../../../utils';

function TextWithIcon({
  icon,
  text,
  height = 20,
  width = 20
}: {
  icon: IconType;
  text: string;
  height?: number;
  width?: number;
}) {
  return (
    <div className="flex items-center">
      <span className="w-[20px] flex items-center justify-center">
        <Icon
          name={icon}
          height={height}
          width={width}
          className="mr-2 rounded-full"
        />
      </span>
      <span className="text-text-secondary ellipsis">{text}</span>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center mt-3">
      <div
        data-loader-type="block"
        className="h-6 w-6 rounded-full mr-1.5"
      ></div>
      <div
        className="flex items-center text-text-secondary h-5"
        data-loader-type="block"
        data-loader-width="75"
      ></div>
    </div>
  );
}

export function UserInfo({
  user = {},
  identity,
  showDetails = false,
  loading
}: {
  user?: RecommendedUser;
  identity?: string;
  showDetails?: boolean;
  loading?: boolean;
}) {
  const { tokenTransfers, follows, poaps, nfts } = user;

  const loader = loading && <Loader />;

  const commonNftCount = nfts?.length || 0;

  let social = user.socials?.find(social => social.profileImage);
  if (!social) {
    social = user.socials?.find(social => social.dappName === 'lens');
  }

  const blockchain =
    social?.blockchain !== 'ethereum' && social?.blockchain !== 'polygon'
      ? ''
      : social?.blockchain;

  const address = user?.addresses?.[0] || '';
  const hasFarcasterFollow =
    follows?.followingOnFarcaster || follows?.followedOnFarcaster;
  const hasLensFollow = follows?.followingOnLens || follows?.followedOnLens;

  return (
    <>
      <div className="flex p-5 bg-glass overflow-hidden">
        <div className="h-[78px] min-w-[78px] w-[78px] mr-4 relative flex justify-center">
          <span className="w-full h-full border-solid-stroke overflow-hidden rounded-full">
            <Asset
              preset="medium"
              containerClassName="w-full h-full flex items-center justify-center"
              chain={blockchain as Chain}
              tokenId={blockchain ? social?.profileTokenId || '' : ''}
              address={social?.profileTokenAddress || ''}
              image={social?.profileImage}
              useImageOnError
              className="[&>img]:!w-full"
            />
          </span>
          <span className="absolute -bottom-2 text-xs bg-stroke-highlight-blue px-1 py-0.5 rounded-md">
            {user._score || 0}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="font-semibold text-base ellipsis">
            {user?.domains?.[0]?.name || address || '--'}
          </div>
          <div className="mb-2 mt-1 text-text-secondary text-xs flex items-center w-full ">
            <span className="mr-1 flex-1 ellipsis max-w-[100px]">
              {address}
            </span>
            <CopyButton value={address} />
          </div>
          <div className="flex items-center [&>img]:mr-3">
            {user.xmtp && <Icon name="xmtp-grey" />}
            {user.domains && <Icon name="ens-grey" />}
            {user.socials?.find(({ dappName }) => dappName === 'lens') && (
              <Icon name="lens-grey" />
            )}
            {user.socials?.find(({ dappName }) => dappName === 'farcaster') && (
              <Icon name="farcaster-grey" />
            )}
          </div>
        </div>
      </div>
      <div className="leading-loose p-5">
        {tokenTransfers && (
          <TextWithIcon
            icon="token-sent"
            text={
              tokenTransfers?.sent && tokenTransfers?.received
                ? `Sent/Received tokens`
                : tokenTransfers?.sent
                ? `Sent tokens`
                : tokenTransfers?.received
                ? `Received tokens`
                : ''
            }
          />
        )}
        {commonNftCount > 0 && (
          <div>
            <TextWithIcon
              icon="nft-common"
              text={`${pluralize(commonNftCount, 'NFT')} in common`}
            />
            {showDetails && <ListWithViewMore items={nfts} loading={loading} />}
          </div>
        )}
        {poaps?.length && (
          <>
            <TextWithIcon
              icon="poap-common"
              text={`${pluralize(poaps?.length, 'POAP')} in common`}
              width={16}
            />
            {showDetails && (
              <ListWithViewMore items={poaps} loading={loading} />
            )}
          </>
        )}
        {hasFarcasterFollow && (
          <TextWithIcon
            icon="farcaster"
            text={
              follows?.followedOnFarcaster && follows?.followedOnFarcaster
                ? 'Farcaster mutual follow'
                : follows?.followingOnFarcaster
                ? `Farcaster followed by ${identity}`
                : follows?.followedOnFarcaster
                ? `Following ${identity} on Farcaster`
                : ''
            }
            height={17}
            width={17}
          />
        )}
        {hasLensFollow && (
          <TextWithIcon
            icon="lens"
            text={
              follows?.followingOnLens && follows?.followedOnLens
                ? 'Lens mutual follow'
                : follows?.followingOnLens
                ? `Lens followed by ${identity}`
                : follows?.followedOnLens
                ? `Following ${identity} on Lens`
                : ''
            }
          />
        )}
        {!tokenTransfers && loader}
        {commonNftCount === 0 && loader}
        {!poaps?.length && loader}
        {!hasFarcasterFollow && loader}
        {!hasLensFollow && loader}
      </div>
    </>
  );
}
