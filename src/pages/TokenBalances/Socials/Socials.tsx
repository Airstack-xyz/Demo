import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { LazyAddressesModal } from '../../../Components/LazyAddressesModal';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { SocialQuery } from '../../../queries';
import { getActiveSocialInfoString } from '../../../utils/activeSocialInfoString';
import { createFormattedRawInput } from '../../../utils/createQueryParamsWithMention';
import { SectionHeader } from '../SectionHeader';
import { Wallet as WalletType } from '../types';
import { Follow, FollowParams, FollowType } from './Follow';
import { Social } from './Social';
import { XMTP } from './XMTP';

const getFollowInfo = (socials: WalletType['socials']) => {
  const followMap: Record<string, FollowType> = {
    farcaster: {
      dappName: 'farcaster',
      sections: []
    },
    lens: {
      dappName: 'lens',
      sections: []
    }
  };

  const farcasterSocials = socials.filter(
    item => item.dappName === 'farcaster'
  );
  const lensSocials = socials.filter(item => item.dappName === 'lens');

  // For farcaster:
  if (farcasterSocials?.length > 0) {
    followMap['farcaster'].sections = farcasterSocials.map(item => ({
      profileName: item.profileName,
      profileTokenId: item.profileTokenId,
      followerCount: item.followerCount,
      followingCount: item.followingCount
    }));
  } else {
    followMap['farcaster'].sections = [
      {
        profileName: '--'
      }
    ];
  }

  // For lens:
  if (lensSocials.length > 0) {
    // find default lens profile based on:
    const defaultProfile =
      lensSocials.find(item => item.isDefault) ||
      lensSocials.find(item => item.followingCount > 0) ||
      lensSocials[0];

    followMap['lens'].sections.push({
      profileName: defaultProfile.profileName,
      profileTokenId: defaultProfile.profileTokenId,
      followerCount: defaultProfile.followerCount,
      followingCount: defaultProfile.followingCount
    });
    lensSocials.forEach(item => {
      if (item.profileName !== defaultProfile.profileName) {
        followMap['lens'].sections.push({
          profileName: item.profileName,
          profileTokenId: item.profileTokenId,
          followerCount: item.followerCount,
          followingCount: defaultProfile.followingCount,
          hideFollowingCount: true
        });
      }
    });
  } else {
    followMap['lens'].sections = [
      {
        profileName: '--'
      }
    ];
  }

  return Object.values(followMap);
};

const iconMap: Record<string, string> = {
  lens: '/images/lens.svg',
  farcaster: '/images/farcaster.svg',
  xmtp: '/images/xmtp.svg',
  ens: '/images/ens.svg'
};

function SocialsComponent() {
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    dataType?: string;
    addresses: string[];
  }>({
    isOpen: false,
    dataType: '',
    addresses: []
  });

  const [{ address }, setData] = useSearchInput();
  const [fetchData, { data, loading }] = useLazyQuery(SocialQuery);

  const wallet = (data?.Wallet || {}) as WalletType;

  useEffect(() => {
    if (address.length > 0) {
      fetchData({
        identity: address[0]
      });
    }
  }, [fetchData, address]);

  const domainsList = useMemo(
    () => wallet?.domains?.map(({ name }) => name),
    [wallet?.domains]
  );

  const xmtpEnabled = useMemo(
    () => wallet?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled),
    [wallet?.xmtp]
  );

  const handleShowMoreClick = useCallback((values: string[], type?: string) => {
    setModalData({
      isOpen: true,
      dataType: type,
      addresses: values
    });
  }, []);

  const handleModalClose = useCallback(() => {
    setModalData({
      isOpen: false,
      dataType: '',
      addresses: []
    });
  }, []);

  const handleFollowValue = useCallback(
    ({
      profileName,
      profileTokenId,
      dappName,
      followerCount,
      followingCount,
      followerTab
    }: FollowParams) => {
      if (!profileName || !profileTokenId) {
        return;
      }
      setData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            profileNames: [profileName],
            profileTokenIds: [profileTokenId],
            dappName,
            followerCount,
            followingCount,
            followerTab
          })
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const handleAddressValue = useCallback(
    (value: unknown, type?: string) => {
      if (typeof value !== 'string' || value == '--') return;

      const isFarcaster = type?.includes('farcaster');
      const farcasterId = `fc_fname:${value}`;

      const rawInput = createFormattedRawInput({
        type: 'ADDRESS',
        address: isFarcaster ? farcasterId : value,
        label: isFarcaster ? farcasterId : value,
        blockchain: 'ethereum'
      });

      setData(
        {
          rawInput: rawInput,
          address: isFarcaster ? [farcasterId] : [value],
          inputType: 'ADDRESS'
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const handleAddressClick = useCallback(
    (value: string, type?: string) => {
      handleAddressValue(value, type);
      handleModalClose();
    },
    [handleModalClose, handleAddressValue]
  );

  const follows = useMemo(
    () => getFollowInfo(wallet?.socials || []),
    [wallet?.socials]
  );

  const primaryEnsValues = wallet?.primaryDomain?.name
    ? [wallet.primaryDomain.name]
    : ['--'];
  const ensValues =
    domainsList && domainsList.length > 0 ? domainsList : ['--'];

  return (
    <div className="w-full sm:w-auto">
      <div className="hidden sm:block">
        <SectionHeader iconName="socials-flat" heading="Socials" />
      </div>
      <div
        className={classNames(
          'rounded-18  border-solid-stroke mt-3.5 min-h-[250px] flex flex-col bg-glass',
          {
            'skeleton-loader': loading
          }
        )}
      >
        <div
          data-loader-type="block"
          data-loader-height="auto"
          className="h-full p-5 flex-1"
        >
          <Social
            name="Primary ENS"
            type="ens"
            values={primaryEnsValues}
            image={iconMap['ens']}
            onAddressClick={handleAddressValue}
          />
          <Social
            name="ENS names"
            type="ens"
            values={ensValues}
            image={iconMap['ens']}
            onAddressClick={handleAddressValue}
            onShowMoreClick={handleShowMoreClick}
          />
          {follows.map((item, index) => (
            <Follow
              {...item}
              key={index}
              image={iconMap[item.dappName]}
              onFollowClick={handleFollowValue}
            />
          ))}
          <Social
            name="XMTP"
            values={xmtpEnabled ? [<XMTP />] : ['--']}
            image={iconMap['xmtp']}
          />
        </div>
      </div>
      {modalData.isOpen && (
        <LazyAddressesModal
          heading={`All ENS names of ${address[0]}`}
          isOpen={modalData.isOpen}
          dataType={modalData.dataType}
          addresses={address}
          onRequestClose={handleModalClose}
          onAddressClick={handleAddressClick}
        />
      )}
    </div>
  );
}

export const Socials = memo(SocialsComponent);
