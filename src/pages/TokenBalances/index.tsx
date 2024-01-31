import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { BlockchainFilter } from '../../Components/Filters/BlockchainFilter';
import { MintFilter } from '../../Components/Filters/MintFilter';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import { SortBy, defaultSortOrder } from '../../Components/Filters/SortBy';
import { SpamFilter } from '../../Components/Filters/SpamFilter';
import { TokenBalanceAllFilters } from '../../Components/Filters/TokenBalanceAllFilters';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Search } from '../../Components/Search';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { Tab, TabContainer } from '../../Components/Tab';
import {
  AccountOwnerData,
  useGetAccountOwner
} from '../../hooks/useGetAccountOwner';
import { useSearchInput } from '../../hooks/useSearchInput';
import { MainLayout } from '../../layouts/MainLayout';
import { SocialOverlapQuery, SocialQuery } from '../../queries';
import { getNftWithCommonOwnersSnapshotQuery } from '../../queries/Snapshots/nftWithCommonOwnersSnapshotQuery';
import { domainDetailsQuery } from '../../queries/domainDetails';
import { getNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { poapsOfCommonOwnersQuery } from '../../queries/poapsOfCommonOwnersQuery';
import { socialDetailsQuery } from '../../queries/socialDetails';
import { getSocialFollowersQuery } from '../../queries/socialFollowersQuery';
import { getSocialFollowingsQuery } from '../../queries/socialFollowingQuery';
import {
  erc20TokenDetailsQuery,
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery
} from '../../queries/tokenDetails';
import { TokenDetailsReset, useTokenDetails } from '../../store/tokenDetails';
import { capitalizeFirstLetter } from '../../utils';
import { getActiveENSInfo } from '../../utils/activeENSInfoString';
import {
  checkBlockchainSupportForSnapshot,
  getActiveSnapshotInfo,
  getSnapshotQueryFilters
} from '../../utils/activeSnapshotInfoString';
import { getActiveSocialInfo } from '../../utils/activeSocialInfoString';
import {
  addToActiveTokenInfo,
  getAllActiveTokenInfo
} from '../../utils/activeTokenInfoString';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { ScoreOverview } from '../OnchainGraph/CommonScore/ScoreOverview';
import { ENSDetails } from './ENSDetails/ENSDetails';
import { ERC20Tokens } from './ERC20/ERC20Tokens';
import { Filters } from './Filters';
import { SectionHeader } from './SectionHeader';
import { SocialDetails } from './SocialDetails/SocialDetails';
import { getSocialFollowFilterData } from './SocialDetails/utils';
import { Socials } from './Socials';
import { SocialsOverlap } from './Socials/SocialsOverlap';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { TokenDetails } from './TokenDetails/TokenDetails';
import { Tokens, TokensLoader } from './Tokens';

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
      mintFilter,
      activeSnapshotInfo
    }
  ] = useSearchInput();

  // force the component to re-render when any of the search input change, so that the ERC20 can reset, refetch
  const erc20Key = useMemo(
    () =>
      `${address}-${blockchainType}-${tokenType}-${sortOrder}-${spamFilter}-${mintFilter}-${activeSnapshotInfo}`,
    [
      address,
      blockchainType,
      tokenType,
      sortOrder,
      spamFilter,
      mintFilter,
      activeSnapshotInfo
    ]
  );

  // !Gnosis: Don't show ERC20 tokens when gnosis blockchain is selected
  const hasGnosisChainFilter =
    blockchainType?.length === 1 && blockchainType[0] === 'gnosis';

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
      {!hasGnosisChainFilter && <ERC20Tokens key={erc20Key} />}
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
      mintFilter,
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
      mintFilter={mintFilter}
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
      mintFilter,
      activeTokenInfo,
      activeSnapshotInfo,
      activeSocialInfo,
      activeENSInfo
    },
    setData
  ] = useSearchInput();

  const handleAccountData = useCallback(
    (account: AccountOwnerData) => {
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
  const ensInfo = useMemo(
    () => getActiveENSInfo(activeENSInfo),
    [activeENSInfo]
  );

  const token = activeTokens[activeTokens.length - 1];

  const isCombination = address.length > 1;
  const isPoap = tokenType === 'POAP';

  const showTokenDetails = Boolean(activeTokenInfo || account);
  const hideBackBreadcrumb = Boolean(account);

  const options = useMemo(() => {
    if (address.length === 0) return [];

    const detailTokensVisible = hasERC6551 && accountAddress;

    const fetchAllBlockchains = blockchainType?.length === 0;

    const isMintFilteringEnabled = mintFilter === '1';

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

    // Token details page options ==================================
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
    // Social details page options ==================================
    else if (socialInfo.isApplicable) {
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
    // Ens details page options ==================================
    else if (ensInfo.isApplicable) {
      const ensDetailsLink = createAppUrlWithQuery(domainDetailsQuery, {
        name: ensInfo.identity
      });

      options.push({
        label: `ENS details`,
        link: ensDetailsLink
      });
    }
    // Tokens page options ==================================
    else {
      if (!snapshotInfo.isApplicable && (!tokenType || tokenType === 'POAP')) {
        const poapsQuery = poapsOfCommonOwnersQuery({ owners });
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
        const tokensQuery = getNftWithCommonOwnersQuery({
          owners,
          blockchain,
          mintsOnly: isMintFilteringEnabled
        });

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

      if (tokenType !== 'POAP') {
        options.push({
          label: 'Token Balances (NFT)',
          link: nftLink
        });
      }

      // !Gnosis: Don't show ERC20 option when gnosis blockchain is selected
      if (blockchain !== 'gnosis') {
        options.push({
          label: 'Token Balances (ERC20)',
          link: erc20Link
        });
      }

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

    return options;
  }, [
    address,
    hasERC6551,
    accountAddress,
    blockchainType,
    mintFilter,
    sortOrder,
    tokenType,
    showTokenDetails,
    token,
    socialInfo.isApplicable,
    socialInfo.dappName,
    socialInfo.followerData,
    socialInfo.profileTokenIds,
    socialInfo.followingData,
    socialInfo.profileNames,
    ensInfo.isApplicable,
    ensInfo.identity,
    snapshotInfo
  ]);

  const { tab1Header, tab2Header } = useMemo(() => {
    let tab1Header = 'NFTs & POAPs';
    let tab2Header = 'Socials & ERC20';
    // !Gnosis: Don't show ERC20 header in tab2 when gnosis blockchain is selected
    if (blockchainType?.length === 1 && blockchainType[0] === 'gnosis') {
      tab2Header = 'Socials';
    }
    if (isCombination) {
      tab1Header += ' in common';
      tab2Header += ' in common';
    }
    return { tab1Header, tab2Header };
  }, [blockchainType, isCombination]);

  // force the component to re-render when any of the search input change, so that the tokens are reset and refetch
  const tokensKey = useMemo(
    () =>
      `${address}-${blockchainType}-${tokenType}-${sortOrder}-${spamFilter}-${mintFilter}-${activeSnapshotInfo}`,
    [
      address,
      blockchainType,
      tokenType,
      sortOrder,
      spamFilter,
      mintFilter,
      activeSnapshotInfo
    ]
  );

  const {
    snapshotFilterDisabled,
    blockchainFilterDisabled,
    sortByFilterDisabled,
    mintFilterDisabled
  } = useMemo(() => {
    let snapshotFilterDisabled = false;
    const blockchainFilterDisabled = false;
    let sortByFilterDisabled = false;
    let mintFilterDisabled = false;

    if (
      blockchainType?.length === 1 &&
      !checkBlockchainSupportForSnapshot(blockchainType[0])
    ) {
      snapshotFilterDisabled = true;
    }
    if (isPoap) {
      snapshotFilterDisabled = true;
    }
    if (isCombination) {
      snapshotFilterDisabled = true;
    }
    if (snapshotInfo.isApplicable) {
      sortByFilterDisabled = true;
      mintFilterDisabled = true;
    }
    return {
      snapshotFilterDisabled,
      blockchainFilterDisabled,
      sortByFilterDisabled,
      mintFilterDisabled
    };
  }, [blockchainType, isCombination, isPoap, snapshotInfo.isApplicable]);

  const isQueryExists = query && query.length > 0;

  const renderFilterContent = () => {
    if (showTokenDetails || socialInfo.isApplicable) {
      return (
        <div className="flex justify-center w-full z-[21]">
          <GetAPIDropdown options={options} dropdownAlignment="center" />
        </div>
      );
    }

    return (
      <div className="flex justify-between w-full z-[21]">
        <div className="flex-row-center gap-3.5">
          {isMobile ? (
            <TokenBalanceAllFilters
              snapshotDisabled={snapshotFilterDisabled}
              blockchainDisabled={blockchainFilterDisabled}
              sortByDisabled={sortByFilterDisabled}
              mintFilterDisabled={mintFilterDisabled}
            />
          ) : (
            <>
              <SnapshotFilter disabled={snapshotFilterDisabled} />
              <BlockchainFilter disabled={blockchainFilterDisabled} />
              <SortBy disabled={sortByFilterDisabled} />
              <MintFilter disabled={mintFilterDisabled} />
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
        <SocialDetails
          identities={address}
          socialInfo={socialInfo}
          activeSocialInfo={activeSocialInfo}
          setQueryData={setData}
        />
      );
    }
    if (ensInfo.isApplicable) {
      return (
        <ENSDetails
          identities={address}
          ensInfo={ensInfo}
          activeENSInfo={activeENSInfo}
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
    <MainLayout>
      <TokenDetailsReset>
        <div
          className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
            'flex-1 h-full w-full flex flex-col !pt-[12vw] items-center text-center':
              isHome
          })}
        >
          <div
            style={{ maxWidth: MAX_SEARCH_WIDTH }}
            className="mx-auto w-full"
          >
            {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
            <Search />
            {isQueryExists && (
              <div className="mt-3 mb-8 flex-row-center">
                {renderFilterContent()}
              </div>
            )}
          </div>
          {isQueryExists && <>{renderViewContent()}</>}
        </div>
      </TokenDetailsReset>
    </MainLayout>
  );
}

export function TokenBalance() {
  const { address } = useSearchInput()[0];
  // always remount the component when the address changes or when the activeTokenInfo gets added or removed
  const key = `${address.join(',')}`;
  return <TokenBalancePage key={key} />;
}
