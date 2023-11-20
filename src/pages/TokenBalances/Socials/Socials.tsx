import { useLazyQuery } from '@airstack/airstack-react';
import classNames from 'classnames';
import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../Components/Icon';
import { LazyAddressesModal } from '../../../Components/LazyAddressesModal';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { SocialQuery } from '../../../queries';
import { formatAddress } from '../../../utils';
import { getActiveSocialInfoString } from '../../../utils/activeSocialInfoString';
import { createFormattedRawInput } from '../../../utils/createQueryParamsWithMention';
import { SectionHeader } from '../SectionHeader';
import { Follow, FollowParams, FollowType } from './Follow';
import { Social } from './Social';
import { XMTP } from './XMTP';
import { WalletType } from './types';

const getSocialFollowInfo = (wallet: WalletType) => {
  const followData: Record<'farcaster' | 'lens', FollowType> = {
    farcaster: {
      dappName: 'farcaster',
      sections: []
    },
    lens: {
      dappName: 'lens',
      sections: []
    }
  };

  // For Farcaster profile - we need to ignore if results for an address does not have 'profileName'
  const farcasterSocials =
    wallet?.farcasterSocials?.filter(item => item.profileName) || [];
  const lensSocials = wallet?.lensSocials || [];

  // For farcaster:
  if (farcasterSocials.length > 0) {
    followData.farcaster.sections = farcasterSocials.map(item => ({
      profileName: item.profileName,
      profileHandle: item.profileHandle,
      profileTokenId: item.profileTokenId,
      followerCount: item.followerCount,
      followingCount: item.followingCount
    }));
  } else {
    followData.farcaster.sections = [
      {
        profileHandle: '--'
      }
    ];
  }

  // For lens:
  if (lensSocials.length > 0) {
    followData.lens.sections = lensSocials.map(item => ({
      profileName: item.profileName,
      profileHandle: item.profileHandle,
      profileTokenId: item.profileTokenId,
      followerCount: item.followerCount,
      followingCount: item.followingCount
    }));
  } else {
    followData.lens.sections = [
      {
        profileHandle: '--'
      }
    ];
  }

  return Object.values(followData);
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

  const wallet = data?.Wallet as WalletType;

  useEffect(() => {
    if (address.length > 0) {
      fetchData({
        identity: address[0]
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

  const handleAddressClick = useCallback(
    (value: string, type?: string) => {
      handleAddressValue(value, type);
      handleModalClose();
    },
    [handleModalClose, handleAddressValue]
  );

  const { primaryEnsValues, ensValues, xmtpValues } = useMemo(() => {
    const primaryEnsValues: ReactNode[] = [];
    const ensValues: ReactNode[] = [];
    const xmtpValues: ReactNode[] = [];

    if (wallet?.primaryDomain?.name) {
      primaryEnsValues.push(wallet.primaryDomain.name);
    } else {
      primaryEnsValues.push('--');
    }
    if (wallet?.domains?.length > 0) {
      ensValues.push(...wallet.domains.map(({ name }) => name));
    } else {
      ensValues.push('--');
    }
    if (wallet?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled)) {
      xmtpValues.push(<XMTP />);
    } else {
      xmtpValues.push('--');
    }

    return {
      primaryEnsValues,
      ensValues,
      xmtpValues
    };
  }, [wallet]);

  const follows = useMemo(() => getSocialFollowInfo(wallet), [wallet]);

  return (
    <div className="w-full sm:w-auto">
      <div className="hidden sm:block">
        <SectionHeader iconName="socials-flat" heading="Socials" />
      </div>
      <Link
        className="rounded-18 border-solid-stroke mt-3.5 bg-glass hover:bg-glass-1 p-5 mb-5 flex items-center"
        to={`/onchain-graph?identity=${address[0]}`}
      >
        <>
          <Icon name="community" height={30} width={30} />
          <span className="text-text-button text-sm font-medium ml-2">
            View Onchain Graph {'->'}{' '}
          </span>
        </>
      </Link>
      <div
        className={classNames(
          'rounded-18 border-solid-stroke mt-3.5 min-h-[250px] flex flex-col bg-glass',
          {
            'skeleton-loader': loading
          }
        )}
      >
        <div
          data-loader-type="block"
          data-loader-height="auto"
          className="h-full py-5 pl-5 pr-2.5 flex-1"
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
          <Social name="XMTP" values={xmtpValues} image={iconMap['xmtp']} />
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
