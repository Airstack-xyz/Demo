import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AddressesModal } from '../../../Components/AddressesModal';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { SocialQuery } from '../../../queries';
import { getActiveSocialInfoString } from '../../../utils/activeSocialInfoString';
import { createFormattedRawInput } from '../../../utils/createQueryParamsWithMention';
import { SectionHeader } from '../SectionHeader';
import { Wallet as WalletType } from '../types';
import { Follow, FollowParams } from './Follow';
import { Social } from './Social';
import { XMTP } from './XMTP';

type FollowType = {
  dappName: string;
  sections: {
    profileNames: string[];
    profileTokenId?: string;
    followerCount?: number;
    followingCount?: number;
  }[];
};

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
      profileNames: [item.profileName],
      profileTokenId: item.profileTokenId,
      followerCount: item.followerCount,
      followingCount: item.followingCount
    }));
  } else {
    followMap['farcaster'].sections = [
      {
        profileNames: ['--'],
        followerCount: 0,
        followingCount: 0
      }
    ];
  }

  // For lens:
  // Find lens profile based on which follower/following are formed
  const relevantLensSocial =
    lensSocials.find(
      item => item.isDefault || item.followerCount || item.followingCount
    ) || lensSocials[0];

  if (relevantLensSocial) {
    followMap['lens'].sections = [
      {
        profileNames: lensSocials.map(item => item.profileName),
        profileTokenId: relevantLensSocial.profileTokenId,
        followerCount: relevantLensSocial.followerCount,
        followingCount: relevantLensSocial.followingCount
      }
    ];
  } else {
    followMap['lens'].sections = [
      {
        profileNames: ['--'],
        followerCount: 0,
        followingCount: 0
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

  const _primaryEnsValues = wallet?.primaryDomain?.name
    ? [wallet.primaryDomain.name]
    : ['--'];
  const _ensValues =
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
            values={_primaryEnsValues}
            image={iconMap['ens']}
            onAddressClick={handleAddressValue}
          />
          <Social
            name="ENS names"
            values={_ensValues}
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
      <AddressesModal
        heading={`All ENS names of ${address[0]}`}
        isOpen={modalData.isOpen}
        addresses={modalData.addresses}
        onRequestClose={handleModalClose}
        onAddressClick={handleAddressClick}
      />
    </div>
  );
}

export const Socials = memo(SocialsComponent);
