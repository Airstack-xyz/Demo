import { Chain } from '@airstack/airstack-react/constants';
import { IconType, Icon } from '../../../Components/Icon';
import { CopyButton } from '../ERC6551/NFTInfo/CopyButton';
import { RecommendedUser } from './types';
import { Asset } from '../../../Components/Asset';
import classNames from 'classnames';
import { ListWithViewMore } from './ListWithViewMore';

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
      <span className="text-text-secondary">{text}</span>
    </div>
  );
}

export function UserInfo({
  user,
  identity,
  showDetails = false
}: {
  user: RecommendedUser;
  identity: string;
  showDetails: boolean;
}) {
  const { tokenTransfers, follows, poaps, nfts } = user;

  const commonNftCount = nfts?.length || 0;

  let social = user.socials?.find(social => social.profileImage);
  if (!social) {
    social = user.socials?.find(social => social.dappName === 'lens');
  }

  const blockchain =
    social?.blockchain !== 'ethereum' && social?.blockchain !== 'polygon'
      ? ''
      : social?.blockchain;

  return (
    <div
      className={classNames(
        'border-solid-stroke bg-glass rounded-18 overflow-hidden h-[326px]',
        {
          'overflow-auto !h-auto': showDetails
        }
      )}
    >
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
            45
          </span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base">
            {user?.domains?.[0]?.name || '--'}
          </div>
          <div className="mb-2 mt-1 text-text-secondary text-xs flex items-center w-full ">
            <span className="mr-1 flex-1 ellipsis max-w-[100px]">
              {user?.addresses?.[0]}
            </span>
            <CopyButton value="" />
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
          <TextWithIcon icon="token-sent" text={`Sent ${identity} tokens`} />
        )}
        {commonNftCount > 0 && (
          <div>
            <TextWithIcon
              icon="nft-common"
              text={`${commonNftCount} NFTs in common`}
            />
            {showDetails && <ListWithViewMore items={nfts} />}
          </div>
        )}
        {!!poaps?.length && (
          <>
            <TextWithIcon
              icon="poap-common"
              text={`${poaps?.length} POAPs in common`}
              width={16}
            />
            {showDetails && <ListWithViewMore items={poaps} />}
          </>
        )}
        {follows?.farcaster && (
          <TextWithIcon
            icon="farcaster"
            text="Farcaster mutual follow"
            height={17}
            width={17}
          />
        )}
        {follows?.lens && (
          <TextWithIcon icon="lens" text="Lens mutual follow" />
        )}
      </div>
    </div>
  );
}
