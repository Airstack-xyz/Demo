import classNames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { CSVDownloadDropdown } from '../../Components/CSVDownload/CSVDownloadDropdown';
import { BlockchainFilter } from '../../Components/Filters/BlockchainFilter';
import { MintFilter } from '../../Components/Filters/MintFilter';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import { SortBy } from '../../Components/Filters/SortBy';
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
import { useCsvDownloadOptions } from '../../store/csvDownload';
import { TokenDetailsReset, useTokenDetails } from '../../store/tokenDetails';
import { getActiveENSInfo } from '../../utils/activeENSInfoString';
import {
  checkBlockchainSupportForSnapshot,
  getActiveSnapshotInfo
} from '../../utils/activeSnapshotInfoString';
import { getActiveSocialInfo } from '../../utils/activeSocialInfoString';
import {
  addToActiveTokenInfo,
  getAllActiveTokenInfo
} from '../../utils/activeTokenInfoString';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { ScoreOverview } from '../OnchainGraph/CommonScore/ScoreOverview';
import { ENSDetails } from './ENSDetails/ENSDetails';
import { ERC20Tokens } from './ERC20/ERC20Tokens';
import { Filters } from './Filters';
import { SectionHeader } from './SectionHeader';
import { SocialDetails } from './SocialDetails/SocialDetails';
import { Socials } from './Socials';
import { SocialsOverlap } from './Socials/SocialsOverlap';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { TokenDetails } from './TokenDetails/TokenDetails';
import { Tokens, TokensLoader } from './Tokens/Tokens';
import { useDropdownOptions } from './hooks/useDropdownOptions';

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

  const [, setCsvDownloadOptions] = useCsvDownloadOptions(['options']);

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

  const tokenInfo = activeTokens[activeTokens.length - 1];

  const isCombination = address.length > 1;
  const isPoap = tokenType === 'POAP';

  const showTokenDetails = Boolean(activeTokenInfo || account);
  const hideBackBreadcrumb = Boolean(account);

  const [getAPIOptions, csvDownloadOptions] = useDropdownOptions({
    socialInfo,
    address,
    hasERC6551,
    accountAddress,
    blockchainType,
    mintFilter,
    sortOrder,
    tokenType,
    showTokenDetails,
    tokenInfo,
    ensInfo,
    snapshotInfo
  });

  useEffect(() => {
    let options = csvDownloadOptions;

    if (socialInfo.isApplicable) {
      options = csvDownloadOptions.filter(option =>
        option.label.includes(
          socialInfo.followerTab ? 'followers' : 'following'
        )
      );
    }

    options = [options[options.length - 1]];

    setCsvDownloadOptions({ options });
  }, [
    csvDownloadOptions,
    setCsvDownloadOptions,
    socialInfo.followerTab,
    socialInfo.isApplicable
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
    if (showTokenDetails) {
      return (
        <div className="flex justify-center gap-3.5 w-full z-[21]">
          <GetAPIDropdown options={getAPIOptions} dropdownAlignment="center" />
        </div>
      );
    }

    if (socialInfo.isApplicable) {
      return (
        <div className="flex justify-center gap-3.5 w-full z-[21]">
          <GetAPIDropdown options={getAPIOptions} dropdownAlignment="center" />
          <CSVDownloadDropdown options={csvDownloadOptions} />
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
        <div className="flex items-center gap-3.5">
          <GetAPIDropdown options={getAPIOptions} dropdownAlignment="right" />
          <CSVDownloadDropdown options={csvDownloadOptions} />
        </div>
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
    <TokenDetailsReset>
      <div
        className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
          'flex-1 h-full w-full flex flex-col !pt-[12vw] items-center text-center':
            isHome
        })}
      >
        <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
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
  );
}

export function TokenBalance() {
  const { address } = useSearchInput()[0];
  // always remount the component when the address changes or when the activeTokenInfo gets added or removed
  const key = `${address.join(',')}`;
  return <TokenBalancePage key={key} />;
}
