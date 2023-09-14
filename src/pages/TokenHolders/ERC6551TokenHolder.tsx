import { ReactNode, useEffect, useMemo } from 'react';
import { useQuery } from '@airstack/airstack-react';
import { SocialQuery } from '../../queries';
import { SocialsType } from '../TokenBalances/types';
import { Asset } from '../../Components/Asset';
import { Chain } from '@airstack/airstack-react/constants';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { addToActiveTokenInfo } from '../../utils/activeTokenInfoString';
import { useTokenDetails } from '../../store/tokenDetails';

function IconAndText({
  icon,
  text,
  loading
}: {
  icon: string;
  text: ReactNode;
  loading?: boolean;
}) {
  return (
    <div
      className={classNames('mb-6 flex items-center font-medium', {
        'skeleton-loader': loading
      })}
    >
      <img
        src={`/images/${icon}.svg`}
        alt=""
        height={35}
        width={35}
        className="mr-3.5 rounded-full"
      />{' '}
      {loading ? (
        <div
          data-loader-type="block"
          data-loader-height="30"
          data-loader-width="50"
        ></div>
      ) : (
        text
      )}
    </div>
  );
}

export function ERC6551TokenHolder({
  owner,
  token
}: {
  owner: string;
  token?: {
    tokenId: string;
    tokenAddress: string;
    blockchain: string;
  };
}) {
  const setDetails = useTokenDetails(['hasERC6551', 'owner'])[1];
  const [{ activeTokenInfo }, setSearchInput] = useSearchInput();
  const { data, loading } = useQuery(SocialQuery, {
    identity: owner
  });

  useEffect(() => {
    setDetails({
      hasERC6551: Boolean(owner),
      owner
    });
  }, [owner, setDetails]);

  const socialDetails = (data?.Wallet || {}) as SocialsType['Wallet'];

  const xmtpEnabled = useMemo(
    () => socialDetails?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled),
    [socialDetails?.xmtp]
  );

  const [lens, farcaster] = useMemo(() => {
    let lens = '';
    let farcaster = '';
    const socials = socialDetails?.socials || [];
    socials.forEach(({ dappName, profileName }) => {
      if (dappName === 'lens') {
        lens = profileName;
      }
      if (dappName === 'farcaster') {
        farcaster = profileName;
      }
    });
    return [lens, farcaster];
  }, [socialDetails?.socials]);

  const otherENS = useMemo(() => {
    const domains = socialDetails?.domains || [];
    const ens = domains.find(
      domain => domain.name !== socialDetails?.primaryDomain?.name
    );
    return ens?.name;
  }, [socialDetails?.domains, socialDetails?.primaryDomain?.name]);

  return (
    <div className="w-[955px] max-w-[98vw]">
      <div className="text-sm rounded-18 overflow-hidden flex items-stretch bg-glass w-full">
        <div className="m-2.5 py-6 px-3 sm:px-6 sm:py-6 border-solid-stroke rounded-18 bg-glass overflow-hidden flex-1">
          <div>
            <span className="rounded-18 px-2.5 py-1 bg-glass-1-light border-solid-stroke">
              ERC6551
            </span>
          </div>
          <div className="text-xl my-5 ellipsis">
            <span className="mr-1.5 text-text-secondary">Holder</span>{' '}
            <span className="flex-1 ellipsis">{owner}</span>
          </div>
          <IconAndText
            loading={loading}
            icon="xmtp"
            text={<span>xmtp is {!xmtpEnabled ? 'not' : ''} enabled</span>}
          />

          <IconAndText
            loading={loading}
            icon="ens"
            text={
              <>
                <span className="text-text-secondary mr-1.5">Primary ENS</span>{' '}
                <span>{socialDetails?.primaryDomain?.name || '--'}</span>
              </>
            }
          />
          <IconAndText
            loading={loading}
            icon="ens"
            text={
              <>
                <span className="text-text-secondary mr-1.5">Other ENS</span>{' '}
                <span>{otherENS || '--'}</span>
              </>
            }
          />
          <IconAndText
            loading={loading}
            icon="lens"
            text={<span>{lens || '--'}</span>}
          />
          <IconAndText
            loading={loading}
            icon="farcaster"
            text={<span>{farcaster || '--'}</span>}
          />
        </div>
        <div
          className={classNames(
            'overflow-hidden w-[422px] min-w-0 hidden sm:block ',
            {
              'skeleton-loader': loading
            }
          )}
          data-loader-type="block"
        >
          <Asset
            address={token?.tokenAddress || ''}
            tokenId={token?.tokenId || ''}
            chain={token?.blockchain as Chain}
            containerClassName="h-full w-full flex items-center [&>img]:w-full"
          />
        </div>
      </div>
      <div className="mt-7 text-center">
        <button
          className={classNames('px-11 py-3.5 rounded-full font-semibold', {
            'skeleton-loader text-transparent': loading,
            'bg-button-primary': !loading
          })}
          data-loader-type="block"
          disabled={loading}
          onClick={() => {
            setSearchInput(
              {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                activeTokenInfo: addToActiveTokenInfo(token!, activeTokenInfo)
              },
              {
                updateQueryParams: true
              }
            );
          }}
        >
          See details of this ERC6551 account
        </button>
      </div>
    </div>
  );
}
