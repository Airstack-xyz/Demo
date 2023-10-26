import { memo, useMemo, useRef } from 'react';
import { Chain } from '@airstack/airstack-react/constants';
import { IconType, Icon } from '../../Components/Icon';
import { RecommendedUser } from './types';
import { Asset } from '../../Components/Asset';
import { ListWithViewMore } from './ListWithViewMore';
import { pluralize } from '../../utils';
import classNames from 'classnames';
import { useInViewportOnce } from '../../hooks/useInViewportOnce';
import { Tooltip } from '../../Components/Tooltip';
import { CopyButton } from '../../Components/CopyButton';
import classnames from 'classnames';

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
    <div className="flex items-center mb-2 last:mb-0">
      <span className="w-[20px] flex items-center justify-center mr-2">
        <Icon
          name={icon}
          height={height}
          width={width}
          className="rounded-full"
        />
      </span>
      <span className="text-text-secondary ellipsis flex-1">{text}</span>
    </div>
  );
}

function IconWithTooltip({ icon, text }: { icon: IconType; text: string }) {
  return (
    <Tooltip
      contentClassName="py-1 px-3 rounded-md left-auto -right-[50px]"
      content={<span>{text}</span>}
    >
      <Icon name={icon} />
    </Tooltip>
  );
}

function Loader() {
  return (
    <div className="flex items-center mb-2 last:mb-0">
      <div
        data-loader-type="block"
        className="h-5 w-5 rounded-full mr-1.5"
      ></div>
      <div
        className="flex items-center text-text-secondary h-4"
        data-loader-type="block"
        data-loader-width="75"
      ></div>
    </div>
  );
}

type UserInfoProps = {
  user?: RecommendedUser;
  identity?: string;
  showDetails?: boolean;
  loading?: boolean;
  onClick?: (address: string) => void;
};

function UserInfo({
  user = {},
  identity,
  showDetails = false,
  loading,
  onClick
}: UserInfoProps) {
  const { tokenTransfers, follows, poaps, nfts } = user;

  const loader = loading && <Loader />;

  const commonNftCount = nfts?.length || 0;
  const poapsCount = poaps?.length || 0;

  const address = useMemo(() => {
    const addresses = (user?.addresses || []).filter(address => {
      return (
        !user._farcasterAddresses?.length ||
        !user._farcasterAddresses?.includes(address)
      );
    });
    return addresses[0] || user?.addresses?.[0] || '';
  }, [user._farcasterAddresses, user?.addresses]);

  const hasFarcasterFollow =
    follows?.followingOnFarcaster || follows?.followedOnFarcaster;
  const hasLensFollow = follows?.followingOnLens || follows?.followedOnLens;

  const social = useMemo(() => {
    const lens = user.socials?.find(social => social.dappName === 'lens');
    const farcaster = user.socials?.find(
      social => social.dappName === 'farcaster'
    );
    return farcaster?.profileImage ? farcaster : lens;
  }, [user.socials]);

  const { lensUserName, farcasterUserName, domain } = useMemo(() => {
    let lensUserName = '';
    let farcasterUserName = '';
    user.socials?.forEach(social => {
      if (social.dappName === 'lens') {
        lensUserName = social.profileName;
      }
      if (social.dappName === 'farcaster') {
        farcasterUserName = social.profileName;
      }
    });
    let domain = user?.primaryDomain?.name || '';
    if (domain) {
      user.domains?.forEach(({ name, isPrimary }) => {
        if (isPrimary) {
          domain = name;
        }
        if (!domain) {
          domain = name;
        }
      });
    }
    return {
      lensUserName,
      farcasterUserName,
      domain
    };
  }, [user.domains, user?.primaryDomain?.name, user.socials]);

  const profileName =
    domain || lensUserName || farcasterUserName || address || '';

  const blockchain =
    social?.blockchain !== 'ethereum' && social?.blockchain !== 'polygon'
      ? ''
      : social?.blockchain;

  return (
    <div
      className="h-full w-full cursor-pointer"
      onClick={() => {
        onClick?.(domain || address);
      }}
    >
      <div className="flex p-5 bg-glass overflow-hidden">
        <div className="h-[78px] min-w-[78px] w-[78px] mr-4 relative flex justify-center">
          <span className="w-full h-full border-solid-stroke overflow-hidden rounded-full">
            <Asset
              preset="medium"
              containerClassName="w-full h-full flex items-center justify-center"
              chain={blockchain as Chain}
              tokenId={blockchain ? social?.profileTokenId || '' : ''}
              address={
                // if there is profile image then set address to empty string so that it doesn't show the token image
                social?.profileImage ? '' : social?.profileTokenAddress || ''
              }
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
            {profileName || '--'}
          </div>
          <div className="mb-2 mt-1 text-text-secondary text-xs flex items-center w-full ">
            <span className="mr-1 ellipsis">{address}</span>
            <span className="ml-0.5">
              <CopyButton value={address} />
            </span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex items-center [&>span]:mr-3 absolute left-[78px] ml-4 px-5 bottom-5">
          {user.xmtp && (
            <IconWithTooltip icon="xmtp-grey" text="xmtp enabled" />
          )}
          {domain && <IconWithTooltip icon="ens-grey" text={domain} />}
          {lensUserName && (
            <IconWithTooltip icon="lens-grey" text={lensUserName} />
          )}
          {farcasterUserName && (
            <IconWithTooltip icon="farcaster-grey" text={farcasterUserName} />
          )}
        </div>
      </div>
      <div
        className={classnames('px-5 pt-5 pb-2.5', {
          'skeleton-loader': loading
        })}
      >
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
        {poapsCount > 0 && (
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
              follows?.followedOnFarcaster && follows?.followingOnFarcaster
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
              follows?.followedOnLens && follows?.followingOnLens
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
        {poapsCount === 0 && loader}
        {!hasFarcasterFollow && loader}
        {!hasLensFollow && loader}
      </div>
    </div>
  );
}

const MemoizedUserInfo = memo((props: UserInfoProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInViewPort = useInViewportOnce(ref);
  return (
    <div
      ref={ref}
      className={classNames(
        'border-solid-stroke bg-glass hover:border-solid-light rounded-18 overflow-hidden h-[290px]',
        {
          'overflow-auto !h-auto': props.showDetails
        }
      )}
    >
      {(isInViewPort || !props.loading) && <UserInfo {...props} />}
    </div>
  );
});

export { MemoizedUserInfo as UserInfo };
