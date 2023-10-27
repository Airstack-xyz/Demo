import { useEffect, useMemo, useState } from 'react';
import { getDefaultScoreMap } from '../utils';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Icon, IconType } from '../../../Components/Icon';
import { pluralize } from '../../../utils';
import classnames from 'classnames';
import {
  fetchPoaps,
  fetchMutualFollowings,
  fetchNfts,
  fetchTokensTransfer,
  getDomainName
} from './dataFetchers';
import { Score } from './Score';

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
  const [domains, setDomains] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [{ address }] = useSearchInput();
  const [nftCount, setNftCount] = useState({
    ethereum: 0,
    polygon: 0
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
  useEffect(() => {
    async function run() {
      setLoading(true);
      const domains = ['', ''];
      const domainForIdentityOne = await getDomainName(address[0]);
      domains[0] = domainForIdentityOne || address[0];

      const domainForIdentityTwo = await getDomainName(address[1]);
      domains[1] = domainForIdentityTwo || address[1];

      setDomains(domains);

      await fetchPoaps(address, (count: number) => setPoapsCount(count));
      const { lens, farcaster } = await fetchMutualFollowings(address);
      setFollow({ lens, farcaster });
      await fetchNfts(address, ({ ethCount, polygonCount }) =>
        setNftCount({
          ethereum: ethCount,
          polygon: polygonCount
        })
      );
      const { tokenSent, tokenReceived } = await fetchTokensTransfer(address);
      setTokenTransfer({ sent: tokenSent, received: tokenReceived });
      setLoading(false);
    }
    run();
  }, [address]);

  const loader = loading && <Loader />;

  const score = useMemo(() => {
    let _score = 0;
    const scoreMap = getDefaultScoreMap();

    const { lens, farcaster } = follow;

    if (lens.following) {
      _score += scoreMap.followingOnLens;
    }
    if (lens.followedBy) {
      _score += scoreMap.followedByOnLens;
    }
    if (farcaster.following) {
      _score += scoreMap.followingOnFarcaster;
    }
    if (farcaster.followedBy) {
      _score += scoreMap.followedByOnFarcaster;
    }
    if (tokenTransfer.sent) {
      _score += scoreMap.tokenSent;
    }
    if (tokenTransfer.received) {
      _score += scoreMap.tokenReceived;
    }
    _score += poapsCount * scoreMap.commonPoaps;
    _score += nftCount.ethereum * scoreMap.commonEthNfts;
    _score += nftCount.polygon * scoreMap.commonPolygonNfts;
    return _score;
  }, [
    follow,
    nftCount.ethereum,
    nftCount.polygon,
    poapsCount,
    tokenTransfer.received,
    tokenTransfer.sent
  ]);
  const { lens, farcaster } = follow;
  const totalNFTCount = nftCount.ethereum + nftCount.polygon;
  const hasFarcasterFollow = farcaster.following || farcaster.followedBy;
  const hasLensFollow = lens.following || lens.followedBy;
  const hasTokenTransfer = tokenTransfer.sent || tokenTransfer.received;

  return (
    <div className="h-[236px] bg-glass flex items-center border-solid-stroke rounded-18">
      <Score score={score} />
      <div
        className={classnames('p-3 sm:p-7 overflow-hidden text-sm flex-1', {
          'skeleton-loader': loading
        })}
      >
        <div className="p-5">
          {hasTokenTransfer && (
            <TextWithIcon
              icon="token-sent"
              text={
                tokenTransfer?.sent && tokenTransfer?.received
                  ? `Sent/Received tokens`
                  : tokenTransfer?.sent
                  ? `${domains[0]} Sent tokens ${domains[0]}`
                  : tokenTransfer?.received
                  ? `${domains[1]} Sent tokens ${domains[0]}`
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
                  ? `${domains[1]} follows ${domains[0]} on Farcaster`
                  : farcaster.following
                  ? `${domains[0]} follows ${domains[1]} on Farcaster`
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
                  ? `${domains[1]} follows ${domains[0]} on Lens`
                  : lens.following
                  ? `${domains[0]} follows ${domains[1]} on Lens`
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
