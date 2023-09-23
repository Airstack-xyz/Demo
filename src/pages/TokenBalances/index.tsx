import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/Layout';
import { Socials } from './Socials';
import { Tokens, TokensLoader } from './Tokens';
import { ERC20Tokens } from './ERC20Tokens';
import { Filters } from './Filters';
import { SectionHeader } from './SectionHeader';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { SocialQuery } from '../../queries';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { SortBy, defaultSortOrder } from '../../Components/Filters/SortBy';
import { createNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { poapsOfCommonOwnersQuery } from '../../queries/poapsOfCommonOwnersQuery';
import { useMatch } from 'react-router-dom';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { BlockchainFilter } from '../../Components/Filters/BlockchainFilter';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import { AllFilters } from '../../Components/Filters/AllFilters';
import { createNftWithCommonOwnersSnapshotQuery } from '../../queries/nftWithCommonOwnersSnapshotQuery';
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
import { getActiveSnapshotInfo } from '../../utils/activeSnapshotInfoString';
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

const SocialsAndERC20 = memo(function SocialsAndERC20({
  hideSocials
}: {
  hideSocials?: boolean;
}) {
  const [
    { address, tokenType, blockchainType, sortOrder, activeSnapshotInfo }
  ] = useSearchInput();

  // force the component to re-render when any of the search input change, so that the ERC20 can reset, refetch
  const erc20Key = useMemo(
    () =>
      `${address.join(
        ','
      )}-${blockchainType}-${tokenType}-${sortOrder}-${activeSnapshotInfo}`,
    [address, blockchainType, tokenType, sortOrder, activeSnapshotInfo]
  );

  return (
    <aside className="w-full min-w-full sm:w-[305px] sm:min-w-[305px] sm:ml-16">
      {address.length <= 1 && !hideSocials && (
        <>
          <Socials />
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
    { address, tokenType, blockchainType, sortOrder, activeSnapshotInfo }
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

  const showTokenDetails = Boolean(activeTokenInfo || account);
  const hideBackBreadcrumb = Boolean(account);

  const options = useMemo(() => {
    if (address.length === 0) return [];

    const detailTokensVisible = hasERC6551 && accountAddress;

    const fetchAllBlockchains =
      blockchainType.length === 2 || blockchainType.length === 0;

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
      const tokensQuery = createNftWithCommonOwnersSnapshotQuery({
        owners,
        blockchain,
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp
      });

      nftLink = createAppUrlWithQuery(tokensQuery, {
        limit: 10,
        tokenType: tokenFilters,
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp
      });

      erc20Link = createAppUrlWithQuery(tokensQuery, {
        limit: 50,
        tokenType: ['ERC20'],
        blockNumber: snapshotInfo.blockNumber,
        date: snapshotInfo.date,
        timestamp: snapshotInfo.timestamp
      });
    } else {
      const tokensQuery = createNftWithCommonOwnersQuery(owners, blockchain);

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
      !snapshotInfo.isApplicable &&
      !socialInfo.isApplicable &&
      tokenType !== 'POAP'
    ) {
      options.push({
        label: 'Token Balances (NFT)',
        link: nftLink
      });
    }

    if (
      !showTokenDetails &&
      !snapshotInfo.isApplicable &&
      !socialInfo.isApplicable
    ) {
      const socialLink = createAppUrlWithQuery(SocialQuery, {
        identity: query
      });

      options.push({
        label: 'Token Balances (ERC20)',
        link: erc20Link
      });

      if (owners.length === 1) {
        options.push({
          label: 'Socials, Domains & XMTP',
          link: socialLink
        });
      }
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

    if (socialInfo.isApplicable) {
      const formattedDappName = capitalizeFirstLetter(socialInfo.dappName);
      const socialFollowersFilterData = getSocialFollowFilterData({
        filters: socialInfo.followerFilters,
        dappName: socialInfo.dappName,
        profileTokenIds: socialInfo.profileTokenIds,
        isFollowerQuery: true
      });
      const socialFollowingsFilterData = getSocialFollowFilterData({
        filters: socialInfo.followingFilters,
        dappName: socialInfo.dappName,
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
          identities: owners,
          dappName: socialInfo.dappName,
          limit: 10,
          ...socialFollowersFilterData.queryFilters
        }
      );

      const socialFollowingDetailsLink = createAppUrlWithQuery(
        socialFollowingDetailsQuery,
        {
          identities: owners,
          dappName: socialInfo.dappName,
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
    snapshotInfo.isApplicable,
    snapshotInfo.blockNumber,
    snapshotInfo.date,
    snapshotInfo.timestamp,
    socialInfo.isApplicable,
    socialInfo.dappName,
    socialInfo.followerFilters,
    socialInfo.profileTokenIds,
    socialInfo.followingFilters,
    socialInfo.profileNames,
    token,
    query
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
      `${address}-${blockchainType}-${tokenType}-${sortOrder}-${snapshotInfo}`,
    [address, blockchainType, tokenType, sortOrder, snapshotInfo]
  );

  const renderFilterContent = () => {
    if (showTokenDetails || socialInfo.isApplicable) {
      return (
        <div className="flex justify-center w-[calc(100vw-20px)] sm:w-[645px]">
          <GetAPIDropdown options={options} dropdownAlignment="center" />
        </div>
      );
    }
    return (
      <div className="flex justify-between w-[calc(100vw-20px)] sm:w-[645px]">
        <div className="flex-row-center gap-3.5">
          {isMobile ? (
            <AllFilters />
          ) : (
            <>
              <SnapshotFilter />
              <BlockchainFilter />
              <SortBy />
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
          onClose={() => setData({ activeTokenInfo: '' })}
          hideBackBreadcrumb={hideBackBreadcrumb}
        />
      );
    }

    if (socialInfo.isApplicable) {
      return (
        <SocialFollows
          key={activeSocialInfo}
          identities={address}
          socialInfo={socialInfo}
          setQueryData={setData}
        />
      );
    }

    return (
      <div key={query} className="flex justify-between px-5">
        <div className="w-full h-full">
          <div className="hidden sm:block">
            <SectionHeader iconName="nft-flat" heading={tab1Header} />
          </div>
          {isMobile && (
            <TabContainer className="sm:hidden">
              <Tab
                icon="nft-flat"
                header={tab1Header}
                active={!showSocials}
                onClick={() => setShowSocials(false)}
              />
              <Tab
                icon="erc20"
                header={tab2Header}
                active={showSocials}
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
              <TokenContainer key={tokensKey} loading={loadingAccount} />
            )
          ) : (
            <TokenContainer key={tokensKey} loading={loadingAccount} />
          )}
        </div>
        {!isMobile && <SocialsAndERC20 />}
        <TokenBalancesLoaderWithInfo />
      </div>
    );
  };

  return (
    <Layout>
      <TokenDetailsReset>
        <div
          className={classNames(
            'flex flex-col px-2 pt-5 w-[1440px] max-w-[100vw] sm:pt-8',
            {
              'flex-1 h-full w-full flex flex-col items-center !pt-[30%] text-center':
                isHome
            }
          )}
        >
          <div className="flex flex-col items-center">
            {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
            <Search />
          </div>
          {query && query.length > 0 && (
            <>
              <div className="m-3 flex-row-center">{renderFilterContent()}</div>
              {renderViewContent()}
            </>
          )}
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
