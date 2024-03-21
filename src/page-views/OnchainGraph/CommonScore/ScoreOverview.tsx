import classnames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon, IconType } from '../../../Components/Icon';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { pluralize } from '../../../utils';
import { Domain, Social, Wallet } from '../../TokenBalances/types';
import { NFTCountData } from '../types/nft';
import { getDefaultScoreMap } from '../utils';
import { Score } from './Score';
import { getProfileDataFromSocial } from './Score/utils';
import {
  fetchMutualFollowings,
  fetchNfts,
  fetchPoaps,
  fetchTokensTransfer,
  getDomainName
} from './dataFetchers';

function Loader() {
  return (
    <div className="flex items-center mb-5 last:mb-0">
      <div
        data-loader-type="block"
        className="h-6 w-6 rounded-full mr-1.5"
      ></div>
      <div
        className="flex items-center text-text-secondary h-5"
        data-loader-type="block"
        data-loader-width="50"
      ></div>
    </div>
  );
}
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
    <div className="flex items-center mb-5 last:mb-0">
      <span className="w-[20px] flex items-center justify-center mr-2">
        <Icon
          name={icon}
          height={height}
          width={width}
          className="rounded-full"
        />
      </span>
      <span className="ellipsis flex-1">{text}</span>
    </div>
  );
}

export function ScoreOverview() {
  const [socials, setSocials] = useState<[Wallet | null, Wallet | null]>([
    null,
    null
  ]);
  const [loading, setLoading] = useState(false);
  const [{ address }] = useSearchInput();
  const [{ ethereumCount, polygonCount, baseCount, zoraCount }, setNftCount] =
    useState<NFTCountData>({
      ethereumCount: 0,
      polygonCount: 0,
      baseCount: 0,
      zoraCount: 0
    });
  const [poapsCount, setPoapsCount] = useState(0);
  const [follow, setFollow] = useState({
    lens: {
      following: false,
      followedBy: false
    },
    farcaster: {
      following: false,
      followedBy: false
    }
  });
  const [tokenTransfer, setTokenTransfer] = useState<{
    sent: boolean;
    received: boolean;
  }>({
    sent: false,
    received: false
  });

  const getSocials = useCallback(async () => {
    const social1 = await getDomainName(address[0]);
    const social2 = await getDomainName(address[1]);
    setSocials([social1, social2]);
    return [social1, social2];
  }, [address]);

  useEffect(() => {
    async function run() {
      setLoading(true);
      await getSocials();
      await fetchPoaps(address, (count: number) => setPoapsCount(count));
      const { lens, farcaster } = await fetchMutualFollowings(address);
      setFollow({ lens, farcaster });
      await fetchNfts(address, countData => setNftCount(countData));
      const { tokenSent, tokenReceived } = await fetchTokensTransfer(address);
      setTokenTransfer({ sent: tokenSent, received: tokenReceived });
      setLoading(false);
    }
    run();
  }, [address, getSocials]);

  const [domains, profiles] = useMemo(() => {
    const domains: [Domain | null, Domain | null] = [null, null];
    const profiles: [Social | null, Social | null] = [null, null];

    {
      const { domain, profile } = getProfileDataFromSocial(
        socials[0],
        address[0]
      );
      domains[0] = domain;
      profiles[0] = profile;
    }

    {
      const { domain, profile } = getProfileDataFromSocial(
        socials[1],
        address[1]
      );
      domains[1] = domain;
      profiles[1] = profile;
    }

    return [domains, profiles];
  }, [address, socials]);

  const score = useMemo(() => {
    let _score = 0;
    const scoreMap = getDefaultScoreMap();

    const { lens, farcaster } = follow;

    if (lens.following) {
      _score += scoreMap.followingOnLens || 0;
    }
    if (lens.followedBy) {
      _score += scoreMap.followedByOnLens || 0;
    }
    if (farcaster.following) {
      _score += scoreMap.followingOnFarcaster || 0;
    }
    if (farcaster.followedBy) {
      _score += scoreMap.followedByOnFarcaster || 0;
    }
    if (tokenTransfer.sent) {
      _score += scoreMap.tokenSent || 0;
    }
    if (tokenTransfer.received) {
      _score += scoreMap.tokenReceived || 0;
    }
    _score += (poapsCount || 0) * scoreMap.commonPoaps;
    _score += (ethereumCount || 0) * scoreMap.commonEthNfts;
    _score += (polygonCount || 0) * scoreMap.commonPolygonNfts;
    _score += (baseCount || 0) * scoreMap.commonBaseNfts;
    _score += (zoraCount || 0) * scoreMap.commonZoraNfts;
    return _score;
  }, [
    baseCount,
    ethereumCount,
    follow,
    poapsCount,
    polygonCount,
    tokenTransfer.received,
    tokenTransfer.sent,
    zoraCount
  ]);

  const totalNFTCount = ethereumCount + polygonCount + baseCount || 0;

  const { lens, farcaster } = follow;
  const hasFarcasterFollow = farcaster.following || farcaster.followedBy;
  const hasLensFollow = lens.following || lens.followedBy;
  const hasTokenTransfer = tokenTransfer.sent || tokenTransfer.received;
  const loader = loading && <Loader />;
  const displayName1 = domains[0]?.name || profiles[0]?.profileHandle;
  const displayName2 = domains[1]?.name || profiles[1]?.profileHandle;

  return (
    <div className="h-auto sm:h-[236px] bg-glass flex flex-col sm:flex-row items-center border-solid-stroke rounded-18">
      <Score
        score={score}
        domains={domains}
        socials={profiles}
        isLoading={loading}
      />
      <div
        className={classnames(
          'p-3 sm:p-7 overflow-hidden text-sm flex-1 w-full sm:w-auto mt-2 sm:mt-0',
          {
            'skeleton-loader': loading
          }
        )}
      >
        <div className="p-2 sm:p-0">
          {hasTokenTransfer && (
            <TextWithIcon
              icon="token-sent"
              text={
                tokenTransfer?.sent && tokenTransfer?.received
                  ? `Sent/Received tokens`
                  : tokenTransfer?.sent
                  ? `${displayName2} Sent tokens ${displayName1}`
                  : tokenTransfer?.received
                  ? `${displayName1} Sent tokens ${displayName2}`
                  : ''
              }
            />
          )}
          {totalNFTCount > 0 && (
            <TextWithIcon
              icon="nft-common"
              text={`${pluralize(totalNFTCount, 'NFT')} in common`}
            />
          )}
          {poapsCount > 0 && (
            <TextWithIcon
              icon="poap-common"
              text={`${pluralize(poapsCount, 'POAP')} in common`}
              width={16}
            />
          )}{' '}
          {hasFarcasterFollow && (
            <TextWithIcon
              icon="farcaster"
              text={
                farcaster.following && farcaster.followedBy
                  ? 'Farcaster mutual follow'
                  : farcaster.followedBy
                  ? `${displayName2} follows ${displayName1} on Farcaster`
                  : farcaster.following
                  ? `${displayName1} follows ${displayName2} on Farcaster`
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
                lens.following && lens.followedBy
                  ? 'Lens mutual follow'
                  : lens.followedBy
                  ? `${displayName2} follows ${displayName1} on Lens`
                  : lens.following
                  ? `${displayName1} follows ${displayName2} on Lens`
                  : ''
              }
            />
          )}
          {!hasTokenTransfer && loader}
          {totalNFTCount === 0 && loader}
          {poapsCount === 0 && loader}
          {!hasFarcasterFollow && loader}
          {!hasLensFollow && loader}
        </div>
      </div>
    </div>
  );
}
