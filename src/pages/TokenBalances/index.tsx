import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/Layout';
import { Socials } from './Socials';
import { Tokens, TokensLoader } from './Tokens';
import { ERC20Tokens } from './ERC20/ERC20Tokens';
import { Filters } from './Filters';
import { SectionHeader } from './SectionHeader';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { SocialOverlapQuery, SocialQuery } from '../../queries';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { SortBy, defaultSortOrder } from '../../Components/Filters/SortBy';
import { getNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { poapsOfCommonOwnersQuery } from '../../queries/poapsOfCommonOwnersQuery';
import { useMatch } from 'react-router-dom';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { BlockchainFilter } from '../../Components/Filters/BlockchainFilter';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import { AllFilters } from '../../Components/Filters/AllFilters';
import { getNftWithCommonOwnersSnapshotQuery } from '../../queries/Snapshots/nftWithCommonOwnersSnapshotQuery';
import { TokenDetails } from './ERC6551/TokenDetails';
import {
  AccountOwner,
  useGetAccountOwner
} from '../../hooks/useGetAccountOwner';
import {
  poapDetailsQuery,
  tokenDetailsQuery,
  erc6551TokensQuery,
  erc20TokenDetailsQuery
} from '../../queries/tokenDetails';
import { TokenDetailsReset, useTokenDetails } from '../../store/tokenDetails';
import {
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../../utils/activeSnapshotInfoString';
import { SocialFollows } from './SocialFollows/SocialFollows';
import { Tab, TabContainer } from '../../Components/Tab';
import { getActiveSocialInfo } from '../../utils/activeSocialInfoString';
import { socialDetailsQuery } from '../../queries/socialDetails';
import { capitalizeFirstLetter } from '../../utils';
import { getSocialFollowFilterData } from './SocialFollows/utils';
import { getSocialFollowersQuery } from '../../queries/socialFollowersQuery';
import { getSocialFollowingsQuery } from '../../queries/socialFollowingQuery';
import {
  addToActiveTokenInfo,
  getAllActiveTokenInfo
} from '../../utils/activeTokenInfoString';
import { SocialsOverlap } from './Socials/SocialsOverlap';
import { ScoreOverview } from '../OnchainGraph/CommonScore/ScoreOverview';
import { SpamFilter } from '../../Components/Filters/SpamFilter';
import { tokenBlockchains } from '../../constants';

const SocialsAndERC20 = memo(function SocialsAndERC20({
  hideSocials
}: {
  hideSocials?: boolean;
}) {
  const [
    {
      address,
      tokenType,
      blockchainType,
      sortOrder,
      spamFilter,
      activeSnapshotInfo
    }
  ] = useSearchInput();

  // force the component to re-render when any of the search input change, so that the ERC20 can reset, refetch
  const erc20Key = useMemo(
    () =>
      `${address}-${blockchainType}-${tokenType}-${sortOrder}-${spamFilter}-${activeSnapshotInfo}`,
    [
      address,
      blockchainType,
      tokenType,
      sortOrder,
      spamFilter,
      activeSnapshotInfo
    ]
  );

  return (
    <aside className="w-full min-w-full sm:w-[305px] sm:min-w-[305px] sm:ml-16">
      {address.length == 1 && !hideSocials && (
        <>
          <Socials />
          <div className="mt-11"></div>
        </>
      )}
      {address.length == 2 && !hideSocials && (
        <>
          <SocialsOverlap />
          <div className="mt-11"></div>
        </>
      )}
      <ERC20Tokens key={erc20Key} />
    </aside>
  );
});

function TokenContainer({
  loading,
  poapDisabled
}: {
  loading: boolean;
  poapDisabled?: boolean;
}) {
  const [
    {
      address,
      tokenType,
      blockchainType,
      sortOrder,
      spamFilter,
      activeSnapshotInfo
    }
  ] = useSearchInput();

  if (!loading) {
    <div>
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
        <TokensLoader />
      </div>
    </div>;
  }

  return (
    <Tokens
      address={address}
      tokenType={tokenType}
      blockchainType={blockchainType}
      sortOrder={sortOrder}
      spamFilter={spamFilter}
      activeSnapshotInfo={activeSnapshotInfo}
      poapDisabled={poapDisabled}
    />
  );
}

function TokenBalancePage() {
  const [
    {
      address,
      tokenType,
      blockchainType,
      sortOrder,
      spamFilter,
      activeTokenInfo,
      activeSnapshotInfo,
      activeSocialInfo
    },
    setData
  ] = useSearchInput();

  const handleAccountData = useCallback(
    (account: AccountOwner) => {
      if (!account) return;
      const { tokenAddress, tokenId, blockchain } = account;
      setData(
        {
          activeTokenInfo: addToActiveTokenInfo({
            tokenAddress,
            tokenId,
            blockchain,
            eventId: ''
          })
        },
        { updateQueryParams: true, replace: true }
      );
    },
    [setData]
  );

  const firstAddress = address[0];
  const canFetchAccount = !activeTokenInfo && address.length === 1;

  // show loader immediately if there is no activeTokenInfo and we will fetch the account
  // this prevents the tokens from loading, showing and then disappearing
  const [loadingAccount, setLoadingAccount] = useState(canFetchAccount);

  const [fetchAccountsOwner, accountData] = useGetAccountOwner(
    firstAddress,
    data => {
      handleAccountData(data);
      setLoadingAccount(false);
    },
    () => {
      setLoadingAccount(false);
    }
  );

  // if there is only one address, we can show the account details
  const account = address.length === 1 ? accountData : null;

  useEffect(() => {
    if (canFetchAccount) {
      setLoadingAccount(true);
      fetchAccountsOwner();
    }
  }, [activeTokenInfo, fetchAccountsOwner, address, canFetchAccount]);

  const query = address.length > 0 ? firstAddress : '';
  const isHome = useMatch('/');

  const [showSocials, setShowSocials] = useState(false);
  const isMobile = isMobileDevice();

  const [{ hasERC6551, accountAddress }] = useTokenDetails([
    'hasERC6551',
    'accountAddress'
  ]);

  const activeTokens = useMemo(() => {
    if (activeTokenInfo) {
      return getAllActiveTokenInfo(activeTokenInfo);
    }
    return [];
  }, [activeTokenInfo]);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const socialInfo = useMemo(
    () => getActiveSocialInfo(activeSocialInfo),
    [activeSocialInfo]
  );

  const token = activeTokens[activeTokens.length - 1];

  const isCombination = address.length > 1;
  const isPoap = tokenType === 'POAP';

  const showTokenDetails = Boolean(activeTokenInfo || account);
  const hideBackBreadcrumb = Boolean(account);

  const options = useMemo(() => {
    if (address.length === 0) return [];

    const detailTokensVisible = hasERC6551 && accountAddress;

    const fetchAllBlockchains =
      blockchainType.length === tokenBlockchains.length ||
      blockchainType.length === 0;

    const owners = detailTokensVisible ? [accountAddress] : address;
    const blockchain = fetchAllBlockchains ? null : blockchainType[0];
    const sortBy = sortOrder ? sortOrder : defaultSortOrder;

    let tokenFilters = ['ERC721', 'ERC1155'];

    if (tokenType) {
      if (tokenType === 'ERC6551') {
        tokenFilters = ['ERC721'];
      } else {
        tokenFilters = [tokenType];
      }
    }

    const options = [];

    if (
      !showTokenDetails &&
      !snapshotInfo.isApplicable &&
      !socialInfo.isApplicable &&
      (!tokenType || tokenType === 'POAP')
    ) {
      const poapsQuery = poapsOfCommonOwnersQuery(owners);

      const poapLink = createAppUrlWithQuery(poapsQuery, {
        limit: 10,
        sortBy
      });

      options.push({
        label: 'POAPs',
        link: poapLink
      });
    }

    let nftLink = '';
    let erc20Link = '';

    if (snapshotInfo.isApplicable) {
      const queryFilters = getSnapshotQueryFilters(snapshotInfo);
      const tokensQuery = getNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain,
        snapshotFilter: snapshotInfo.appliedFilter
      });

      nftLink = createAppUrlWithQuery(tokensQuery, {
        limit: 10,
        tokenType: tokenFilters,
        ...queryFilters
      });

      erc20Link = createAppUrlWithQuery(tokensQuery, {
        limit: 50,
        tokenType: ['ERC20'],
        ...queryFilters
      });
    } else {
      const tokensQuery = getNftWithCommonOwnersQuery(owners, blockchain);

      nftLink = createAppUrlWithQuery(tokensQuery, {
        limit: 10,
        sortBy: sortBy,
        tokenType: tokenFilters
      });

      erc20Link = createAppUrlWithQuery(tokensQuery, {
        limit: 50,
        sortBy: sortBy,
        tokenType: ['ERC20']
      });
    }

    if (
      (!showTokenDetails || detailTokensVisible) &&
      !socialInfo.isApplicable &&
      tokenType !== 'POAP'
    ) {
      options.push({
        label: 'Token Balances (NFT)',
        link: nftLink
      });
    }

    if (!showTokenDetails && !socialInfo.isApplicable) {
      options.push({
        label: 'Token Balances (ERC20)',
        link: erc20Link
      });

      if (address.length === 1) {
        const socialLink = createAppUrlWithQuery(SocialQuery, {
          identity: address[0]
        });

        options.push({
          label: 'Socials, Domains & XMTP',
          link: socialLink
        });
      }

      if (address.length === 2) {
        const socialLink = createAppUrlWithQuery(SocialOverlapQuery, {
          identity1: address[0],
          identity2: address[1]
        });

        options.push({
          label: 'Socials, Domains & XMTP',
          link: socialLink
        });
      }

      options.push({
        label: 'Spam Filters Guide',
        link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp/spam-filters'
      });
    }

    if (showTokenDetails && token) {
      const erc6551AccountsQueryLink = createAppUrlWithQuery(
        erc6551TokensQuery,
        {
          tokenAddress: token.tokenAddress,
          blockchain: token.blockchain,
          tokenId: token.tokenId
        }
      );

      const poapDetailsQueryLink = createAppUrlWithQuery(poapDetailsQuery, {
        tokenAddress: token.tokenAddress,
        eventId: token.eventId
      });

      const tokenDetailsQueryLink = createAppUrlWithQuery(tokenDetailsQuery, {
        tokenAddress: token.tokenAddress,
        blockchain: token.blockchain,
        tokenId: token.tokenId
      });

      const erc20DetailsQueryLink = createAppUrlWithQuery(
        erc20TokenDetailsQuery,
        {
          tokenAddress: token.tokenAddress,
          blockchain: token.blockchain,
          tokenId: token.tokenId
        }
      );

      if (token?.eventId) {
        options.push({
          label: 'POAP Details',
          link: poapDetailsQueryLink
        });
      } else {
        options.push({
          label: 'Token Details',
          link: token?.tokenId ? tokenDetailsQueryLink : erc20DetailsQueryLink
        });
      }

      if (hasERC6551) {
        options.push({
          label: 'ERC6551 Accounts',
          link: erc6551AccountsQueryLink
        });
      }
    }

    if (!showTokenDetails && socialInfo.isApplicable) {
      const formattedDappName = capitalizeFirstLetter(socialInfo.dappName);
      const socialFollowersFilterData = getSocialFollowFilterData({
        ...socialInfo.followerData,
        dappName: socialInfo.dappName,
        identities: address,
        profileTokenIds: socialInfo.profileTokenIds,
        isFollowerQuery: true
      });
      const socialFollowingsFilterData = getSocialFollowFilterData({
        ...socialInfo.followingData,
        dappName: socialInfo.dappName,
        identities: address,
        profileTokenIds: socialInfo.profileTokenIds,
        isFollowerQuery: false
      });

      const socialFollowersDetailsQuery = getSocialFollowersQuery(
        socialFollowersFilterData
      );
      const socialFollowingDetailsQuery = getSocialFollowingsQuery(
        socialFollowingsFilterData
      );

      const socialFollowersDetailsLink = createAppUrlWithQuery(
        socialFollowersDetailsQuery,
        {
          limit: 10,
          ...socialFollowersFilterData.queryFilters
        }
      );

      const socialFollowingDetailsLink = createAppUrlWithQuery(
        socialFollowingDetailsQuery,
        {
          limit: 10,
          ...socialFollowingsFilterData.queryFilters
        }
      );

      const socialDetailsLink = createAppUrlWithQuery(socialDetailsQuery, {
        identities: owners,
        profileNames: socialInfo.profileNames,
        dappName: socialInfo.dappName
      });

      options.push({
        label: `${formattedDappName} followers`,
        link: socialFollowersDetailsLink
      });

      options.push({
        label: `${formattedDappName} following`,
        link: socialFollowingDetailsLink
      });

      options.push({
        label: `${formattedDappName} profile details`,
        link: socialDetailsLink
      });
    }

    return options;
  }, [
    address,
    hasERC6551,
    accountAddress,
    blockchainType,
    sortOrder,
    tokenType,
    showTokenDetails,
    snapshotInfo,
    socialInfo.isApplicable,
    socialInfo.dappName,
    socialInfo.followerData,
    socialInfo.profileTokenIds,
    socialInfo.followingData,
    socialInfo.profileNames,
    token
  ]);

  const { tab1Header, tab2Header } = useMemo(() => {
    const tab1Header = `NFTs & POAPs${isCombination ? ' in common' : ''}`;
    const tab2Header = `${isCombination ? 'ERC20' : 'Socials & ERC20'}${
      isCombination ? ' in common' : ''
    }`;
    return { tab1Header, tab2Header };
  }, [isCombination]);

  // force the component to re-render when any of the search input change, so that the tokens are reset and refetch
  const tokensKey = useMemo(
    () =>
      `${address}-${blockchainType}-${tokenType}-${sortOrder}-${spamFilter}-${activeSnapshotInfo}`,
    [
      address,
      blockchainType,
      tokenType,
      sortOrder,
      spamFilter,
      activeSnapshotInfo
    ]
  );

  const { snapshotTooltip, blockchainTooltip, sortByTooltip } = useMemo(() => {
    let snapshotTooltip = '';
    let blockchainTooltip = '';
    let sortByTooltip = '';
    if (isPoap) {
      snapshotTooltip = 'Snapshots is disabled for POAP';
      blockchainTooltip = 'Blockchain is disabled for POAP';
    }
    if (isCombination) {
      snapshotTooltip = 'Snapshots is disabled for combinations';
    }
    if (snapshotInfo.isApplicable) {
      // TODO: Update blockchain tooltip message when snapshot is released for other blockchains
      blockchainTooltip = 'Snapshots is only enabled for Ethereum chain';
      sortByTooltip = 'Sorting is disabled for Snapshots';
    }
    return {
      snapshotTooltip,
      blockchainTooltip,
      sortByTooltip
    };
  }, [isCombination, isPoap, snapshotInfo.isApplicable]);

  const isQueryExists = query && query.length > 0;

  const renderFilterContent = () => {
    if (showTokenDetails || socialInfo.isApplicable) {
      return (
        <div className="flex justify-center w-full z-[21]">
          <GetAPIDropdown options={options} dropdownAlignment="center" />
        </div>
      );
    }

    const isSnapshotFilterDisabled = Boolean(snapshotTooltip);

    const isBlockchainFilterDisabled = Boolean(blockchainTooltip);

    const isSortByDisabled = Boolean(sortByTooltip);

    return (
      <div className="flex justify-between w-full z-[21]">
        <div className="flex-row-center gap-3.5">
          {isMobile ? (
            <AllFilters
              snapshotDisabled={isSnapshotFilterDisabled}
              blockchainDisabled={isBlockchainFilterDisabled}
              sortByDisabled={isSortByDisabled}
            />
          ) : (
            <>
              <SnapshotFilter
                disabled={isSnapshotFilterDisabled}
                disabledTooltipText={snapshotTooltip}
              />
              <BlockchainFilter
                disabled={isBlockchainFilterDisabled}
                disabledTooltipText={blockchainTooltip}
              />
              <SortBy
                disabled={isSortByDisabled}
                disabledTooltipText={sortByTooltip}
              />
              <SpamFilter />
            </>
          )}
        </div>
        <GetAPIDropdown options={options} dropdownAlignment="right" />
      </div>
    );
  };

  const renderViewContent = () => {
    if (showTokenDetails) {
      return (
        <TokenDetails
          activeTokens={activeTokens}
          key={activeTokenInfo}
          showLoader={loadingAccount}
          socialInfo={socialInfo}
          onClose={() => setData({ activeTokenInfo: '' })}
          hideBackBreadcrumb={hideBackBreadcrumb}
        />
      );
    }

    if (socialInfo.isApplicable) {
      return (
        <SocialFollows
          identities={address}
          socialInfo={socialInfo}
          activeSocialInfo={activeSocialInfo}
          setQueryData={setData}
        />
      );
    }
    return (
      <div key={query} className="flex justify-between sm:px-5">
        <div className="w-full h-full">
          {address.length > 1 && (
            <div className="mb-12 relative z-20">
              <div className="mb-4">
                <SectionHeader iconName="overview" heading="Overview" />
              </div>
              <ScoreOverview />
            </div>
          )}
          <div className="hidden sm:block">
            <SectionHeader iconName="nft-flat" heading={tab1Header} />
          </div>
          {isMobile && (
            <TabContainer className="sm:hidden">
              <Tab
                icon="nft-flat"
                header={tab1Header}
                active={!showSocials}
                className="max-w-[50%] overflow-hidden"
                onClick={() => setShowSocials(false)}
              />
              <Tab
                icon="erc20"
                header={tab2Header}
                active={showSocials}
                className="max-w-[50%] overflow-hidden"
                onClick={() => setShowSocials(true)}
              />
            </TabContainer>
          )}
          <div className="mt-3.5 mb-5 z-[15] relative">
            {(!isMobile || !showSocials) && <Filters />}
          </div>
          {isMobile ? (
            showSocials ? (
              <SocialsAndERC20 />
            ) : (
              <TokenContainer
                key={tokensKey}
                loading={loadingAccount}
                poapDisabled={snapshotInfo.isApplicable}
              />
            )
          ) : (
            <TokenContainer
              key={tokensKey}
              loading={loadingAccount}
              poapDisabled={snapshotInfo.isApplicable}
            />
          )}
        </div>
        {!isMobile && <SocialsAndERC20 />}
        {isCombination && <TokenBalancesLoaderWithInfo key={tokensKey} />}
      </div>
    );
  };

  return (
    <Layout>
      <TokenDetailsReset>
        <div
          className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
            'flex-1 h-full w-full flex flex-col translate-y-[10vw] items-center text-center':
              isHome
          })}
        >
          <div className="max-w-[645px] mx-auto w-full">
            {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
            <Search />
            {isQueryExists && (
              <div className="my-3 flex-row-center">
                {renderFilterContent()}
              </div>
            )}
          </div>
          {isQueryExists && <>{renderViewContent()}</>}
        </div>
      </TokenDetailsReset>
    </Layout>
  );
}

export function TokenBalance() {
  const { address } = useSearchInput()[0];
  // always remount the component when the address changes or when the activeTokenInfo gets added or removed
  const key = `${address.join(',')}`;
  return <TokenBalancePage key={key} />;
}
