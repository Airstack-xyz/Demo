import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { LazyAddressesModal } from '../../../Components/LazyAddressesModal';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { SocialOverlapQuery } from '../../../queries';
import { formatAddress } from '../../../utils';
import { getActiveSocialInfoString } from '../../../utils/activeSocialInfoString';
import { createFormattedRawInput } from '../../../utils/createQueryParamsWithMention';
import { SectionHeader } from '../SectionHeader';
import {
  FollowCombination,
  FollowCombinationParams,
  FollowCombinationType
} from './FollowCombination';
import { SocialCombination } from './SocialCombination';
import { XMTP } from './XMTP';
import { SocialSectionType, WalletType } from './types';

const iconMap: Record<string, string> = {
  lens: '/images/lens.svg',
  farcaster: '/images/farcaster.svg',
  xmtp: '/images/xmtp.svg',
  ens: '/images/ens.svg'
};

const getSocialFollowInfo = (
  wallet1: WalletType,
  wallet2: WalletType,
  address: string[]
) => {
  const followData: Record<string, FollowCombinationType> = {};

  const [address1, address2] = address || [];

  const farcasterSocials1 = wallet1?.farcasterSocials || [];
  const lensSocials1 = wallet1?.lensSocials || [];
  // const user1FollowsUser2OnFarcaster = Boolean(
  //   wallet1?.farcasterFollowers?.Follower?.length
  // );
  // const user1FollowsUser2OnLens = Boolean(
  //   wallet1?.lensFollowers?.Follower?.length
  // );

  const farcasterSocials2 = wallet2?.farcasterSocials || [];
  const lensSocials2 = wallet2?.lensSocials || [];
  // const user2FollowsUser1OnFarcaster = Boolean(
  //   wallet2?.farcasterFollowers?.Follower?.length
  // );
  // const user2FollowsUser1OnLens = Boolean(
  //   wallet2?.lensFollowers?.Follower?.length
  // );

  // For farcaster:
  if (farcasterSocials1.length > 0 && farcasterSocials2.length > 0) {
    followData.farcaster = {
      name: 'both have Farcaster',
      image: iconMap['farcaster'],
      dappName: 'farcaster',
      sections: []
    };
    // for farcaster follower info
    // if (user1FollowsUser2OnFarcaster || user2FollowsUser1OnFarcaster) {
    //   const identity1 = address1?.startsWith('0x')
    //     ? farcasterSocials1[0].profileName
    //     : address1;
    //   const identity2 = address2?.startsWith('0x')
    //     ? farcasterSocials2[0].profileName
    //     : address2;

    //   if (user1FollowsUser2OnFarcaster && user2FollowsUser1OnFarcaster) {
    //     followData.farcaster.followInfo = {
    //       icon: 'mutual-follow',
    //       text: 'Mutual follow'
    //     };
    //   } else if (user1FollowsUser2OnFarcaster) {
    //     followData.farcaster.followInfo = {
    //       icon: 'follow-purple',
    //       text: `${identity1} follows ${identity2}`
    //     };
    //   } else if (user2FollowsUser1OnFarcaster) {
    //     followData.farcaster.followInfo = {
    //       icon: 'follow-purple',
    //       text: `${identity2} follows ${identity1}`
    //     };
    //   }
    // }
    // for farcaster socials for identity1
    followData.farcaster.sections.push({
      name: address1,
      values: farcasterSocials1.map(item => ({
        profileName1: item.profileName,
        profileTokenId1: item.profileTokenId,
        // TODO: Remove count for social-follow-v3
        followerCount: item.followerCount,
        followingCount: item.followingCount,
        profileName2: farcasterSocials2[0].profileName,
        profileTokenId2: farcasterSocials2[0].profileTokenId
      }))
    });
    // for farcaster socials for identity2
    followData.farcaster.sections.push({
      name: address2,
      values: farcasterSocials2.map(item => ({
        profileName1: item.profileName,
        profileTokenId1: item.profileTokenId,
        // TODO: Remove count for social-follow-v3
        followerCount: item.followerCount,
        followingCount: item.followingCount,
        profileName2: farcasterSocials1[0].profileName,
        profileTokenId2: farcasterSocials1[0].profileTokenId
      }))
    });
  }

  // For lens:
  if (lensSocials1.length > 0 && lensSocials2.length > 0) {
    followData.lens = {
      name: 'both have Lens',
      image: iconMap['lens'],
      dappName: 'lens',
      sections: []
    };
    // for lens follower info
    // if (user1FollowsUser2OnLens || user2FollowsUser1OnLens) {
    //   const identity1 = address1?.startsWith('0x')
    //     ? lensSocials1[0].profileName
    //     : address1;
    //   const identity2 = address2?.startsWith('0x')
    //     ? lensSocials2[0].profileName
    //     : address2;

    //   if (user1FollowsUser2OnLens && user2FollowsUser1OnLens) {
    //     followData.lens.followInfo = {
    //       icon: 'mutual-follow',
    //       text: 'Mutual follow'
    //     };
    //   } else if (user1FollowsUser2OnLens) {
    //     followData.lens.followInfo = {
    //       icon: 'follow-purple',
    //       text: `${identity1} follows ${identity2}`
    //     };
    //   } else if (user2FollowsUser1OnLens) {
    //     followData.lens.followInfo = {
    //       icon: 'follow-purple',
    //       text: `${identity2} follows ${identity1}`
    //     };
    //   }
    // }
    // for farcaster socials for identity1
    followData.lens.sections.push({
      name: address1,
      values: lensSocials1.map(item => ({
        profileName1: item.profileName,
        profileTokenId1: item.profileTokenId,
        // TODO: Remove count for social-follow-v3
        followerCount: item.followerCount,
        followingCount: item.followingCount,
        profileName2: lensSocials2[0].profileName,
        profileTokenId2: lensSocials2[0].profileTokenId
      }))
    });
    // for farcaster socials for identity2
    followData.lens.sections.push({
      name: address2,
      values: lensSocials2.map(item => ({
        profileName1: item.profileName,
        profileTokenId1: item.profileTokenId,
        // TODO: Remove count for social-follow-v3
        followerCount: item.followerCount,
        followingCount: item.followingCount,
        profileName2: lensSocials1[0].profileName,
        profileTokenId2: lensSocials1[0].profileTokenId
      }))
    });
  }

  return Object.values(followData);
};

function SocialsOverlapComponent() {
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
  const [fetchData, { data, loading, error }] =
    useLazyQuery(SocialOverlapQuery);

  const wallet1 = data?.wallet1 as WalletType;
  const wallet2 = data?.wallet2 as WalletType;

  useEffect(() => {
    if (address.length > 0) {
      fetchData({
        identity1: address[0],
        identity2: address[1]
      });
    }
  }, [fetchData, address]);

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

  const handleAddressValue = useCallback(
    (value: unknown, type?: string) => {
      if (typeof value !== 'string' || value == '--') return;

      const addressValue = formatAddress(value, type);

      const rawInput = createFormattedRawInput({
        type: 'ADDRESS',
        address: addressValue,
        label: addressValue,
        blockchain: 'ethereum'
      });

      setData(
        {
          rawInput: rawInput,
          address: [addressValue],
          inputType: 'ADDRESS'
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const handleFollowValue = useCallback(
    ({
      dappName,
      profileName1,
      profileTokenId1,
      followerCount,
      followingCount,
      followerTab
    }: FollowCombinationParams) => {
      setData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            profileNames: [profileName1],
            profileTokenIds: [profileTokenId1],
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

  const handleAddressClick = useCallback(
    (value: string, type?: string) => {
      handleAddressValue(value, type);
      handleModalClose();
    },
    [handleModalClose, handleAddressValue]
  );

  const { primaryEnsSections, ensSections, xmtpSections } = useMemo(() => {
    const primaryEnsSections: SocialSectionType[] = [];
    const ensSections: SocialSectionType[] = [];
    const xmtpSections: SocialSectionType[] = [];

    if (wallet1?.primaryDomain?.name && wallet2?.primaryDomain?.name) {
      primaryEnsSections.push(
        { name: address[0], values: [wallet1.primaryDomain.name] },
        { name: address[1], values: [wallet2.primaryDomain.name] }
      );
    }
    if (wallet1?.domains?.length > 0 && wallet2?.domains?.length > 0) {
      ensSections.push(
        { name: address[0], values: wallet1.domains.map(({ name }) => name) },
        { name: address[1], values: wallet2.domains.map(({ name }) => name) }
      );
    }
    if (
      wallet1?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled) &&
      wallet2?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled)
    ) {
      xmtpSections.push(
        {
          name: address[0],
          values: [<XMTP />]
        },
        {
          name: address[1],
          values: [<XMTP />]
        }
      );
    }

    return {
      primaryEnsSections,
      ensSections,
      xmtpSections
    };
  }, [address, wallet1, wallet2]);

  const follows = useMemo(
    () => getSocialFollowInfo(wallet1, wallet2, address),
    [wallet1, wallet2, address]
  );

  const dataNotFound =
    !error &&
    !loading &&
    primaryEnsSections.length === 0 &&
    ensSections.length === 0 &&
    xmtpSections.length === 0 &&
    follows.length === 0;

  return (
    <div className="w-full sm:w-auto">
      <SectionHeader iconName="socials-flat" heading="Socials overlap" />
      <div
        className={classNames(
          'rounded-18 border-solid-stroke mt-3.5 flex flex-col bg-glass',
          {
            'skeleton-loader min-h-[605px]': loading
          }
        )}
      >
        <div
          data-loader-type="block"
          data-loader-height="auto"
          className="h-full py-5 pl-5 pr-2.5 flex-1"
        >
          {primaryEnsSections.length > 0 && (
            <SocialCombination
              name="both have primary ENS"
              type="ens"
              sections={primaryEnsSections}
              image={iconMap['ens']}
              onAddressClick={handleAddressValue}
            />
          )}
          {ensSections.length > 0 && (
            <SocialCombination
              name="both have ENS names"
              type="ens"
              sections={ensSections}
              image={iconMap['ens']}
              onAddressClick={handleAddressValue}
              onShowMoreClick={handleShowMoreClick}
            />
          )}
          {follows.map((item, index) => (
            <FollowCombination
              {...item}
              key={index}
              image={iconMap[item.dappName]}
              onFollowClick={handleFollowValue}
            />
          ))}
          {xmtpSections.length > 0 && (
            <SocialCombination
              name="both have enabled XMTP"
              image={iconMap['xmtp']}
            />
          )}
          {dataNotFound && (
            <div className="flex flex-1 justify-center text-xs">
              No overlap found!
            </div>
          )}
        </div>
      </div>
      {modalData.isOpen && (
        <LazyAddressesModal
          heading={`All ENS names of ${modalData.addresses[0]}`}
          isOpen={modalData.isOpen}
          dataType={modalData.dataType}
          addresses={modalData.addresses}
          onRequestClose={handleModalClose}
          onAddressClick={handleAddressClick}
        />
      )}
    </div>
  );
}

export const SocialsOverlap = memo(SocialsOverlapComponent);
