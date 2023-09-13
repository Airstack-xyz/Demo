import { memo, useEffect, useMemo, useState } from 'react';
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
import { tokenTypes } from './constants';
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
import { useGetAccountOwner } from '../../hooks/useGetAccountOwner';
import {
  poapDetailsQuery,
  tokenDetailsQuery,
  erc6551TokensQuery,
  erc20TokenDetailsQuery
} from '../../queries/tokenDetails';
import { TokenDetailsReset, useTokenDetails } from '../../store/tokenDetails';
import { getActiveSnapshotInfo } from '../../utils/activeSnapshotInfoString';
import { IconType } from '../../Components/Icon';

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

function MobileTab({
  icon,
  header,
  active,
  onClick
}: {
  icon: IconType;
  header: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'pb-2 flex-1 flex justify-center border-b-4 border-solid border-text-secondary -mb-1',
        {
          '!border-transparent [&>div]:font-normal text-text-secondary': active
        }
      )}
    >
      <SectionHeader iconName={icon} heading={header} />
    </div>
  );
}

export function TokenBalance() {
  const [
    {
      address,
      tokenType,
      blockchainType,
      sortOrder,
      activeSnapshotInfo,
      activeTokenInfo
    },
    setData
  ] = useSearchInput();

  const query = address.length > 0 ? address[0] : '';

  const [fetchAccountsOwner, account, loadingAccount] =
    useGetAccountOwner(query);

  const isHome = useMatch('/');
  const [showSocials, setShowSocials] = useState(false);
  const isMobile = isMobileDevice();

  const [{ hasERC6551 }] = useTokenDetails(['hasERC6551']);

  const isCombination = address.length > 1;

  const showTokenDetails = Boolean(activeTokenInfo || account);
  const hideBackBreadcrumb = Boolean(account);

  const snapshot = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const token = useMemo(() => {
    if (account && !activeTokenInfo) {
      const { tokenAddress, tokenId, blockchain } = account;
      return {
        tokenAddress,
        tokenId,
        blockchain,
        eventId: ''
      };
    }
    const [tokenAddress, tokenId, blockchain, eventId] =
      activeTokenInfo.split(' ');
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  }, [account, activeTokenInfo]);

  useEffect(() => {
    if ((activeTokenInfo && address.length === 0) || address.length > 1) return;
    fetchAccountsOwner();
  }, [activeTokenInfo, address, fetchAccountsOwner]);

  const options = useMemo(() => {
    if (address.length === 0) return [];

    const fetchAllBlockchains =
      blockchainType.length === 2 || blockchainType.length === 0;

    const _blockchain = fetchAllBlockchains ? null : blockchainType[0];
    const _limit = tokenType
      ? [tokenType]
      : tokenTypes.filter(tokenType => tokenType !== 'POAP');
    const _sortBy = sortOrder ? sortOrder : defaultSortOrder;

    const options = [];

    if (
      !snapshot.isApplicable &&
      !showTokenDetails &&
      (!tokenType || tokenType === 'POAP')
    ) {
      const poapsQuery = poapsOfCommonOwnersQuery(address);

      const poapLink = createAppUrlWithQuery(poapsQuery, {
        limit: 10,
        sortBy: _sortBy
      });

      options.push({
        label: 'POAPs',
        link: poapLink
      });
    }

    let nftLink = '';
    let erc20Link = '';

    if (snapshot.isApplicable) {
      const tokensQuery = createNftWithCommonOwnersSnapshotQuery({
        owners: address,
        blockchain: _blockchain,
        blockNumber: snapshot.blockNumber,
        date: snapshot.date,
        timestamp: snapshot.timestamp
      });

      nftLink = createAppUrlWithQuery(tokensQuery, {
        limit: 10,
        tokenType: _limit,
        blockNumber: snapshot.blockNumber,
        date: snapshot.date,
        timestamp: snapshot.timestamp
      });

      erc20Link = createAppUrlWithQuery(tokensQuery, {
        limit: 50,
        tokenType: ['ERC20'],
        blockNumber: snapshot.blockNumber,
        date: snapshot.date,
        timestamp: snapshot.timestamp
      });
    } else {
      const tokensQuery = createNftWithCommonOwnersQuery(address, _blockchain);

      nftLink = createAppUrlWithQuery(tokensQuery, {
        limit: 10,
        sortBy: _sortBy,
        tokenType: _limit
      });

      erc20Link = createAppUrlWithQuery(tokensQuery, {
        limit: 50,
        sortBy: _sortBy,
        tokenType: ['ERC20']
      });
    }

    if ((!showTokenDetails || hasERC6551) && tokenType !== 'POAP') {
      options.push({
        label: 'Token Balances (NFT)',
        link: nftLink
      });
    }

    if (!snapshot.isApplicable && !showTokenDetails) {
      const socialLink = createAppUrlWithQuery(SocialQuery, {
        identity: query
      });

      options.push({
        label: 'Token Balances (ERC20)',
        link: erc20Link
      });

      if (address.length === 1) {
        options.push({
          label: 'Socials, Domains & XMTP',
          link: socialLink
        });
      }
    }

    if (showTokenDetails) {
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

    return options;
  }, [
    address,
    blockchainType,
    tokenType,
    sortOrder,
    snapshot.isApplicable,
    snapshot.blockNumber,
    snapshot.date,
    snapshot.timestamp,
    showTokenDetails,
    hasERC6551,
    query,
    token.tokenAddress,
    token.blockchain,
    token.tokenId,
    token.eventId
  ]);

  const { tab1Header, tab2Header } = useMemo(() => {
    const tab1Header = `${snapshot.isApplicable ? 'NFTs' : 'NFTs & POAPs'}${
      isCombination ? ' in common' : ''
    }`;
    const tab2Header = `${
      snapshot.isApplicable || !isCombination ? 'ERC20' : 'Socials & ERC20'
    }${isCombination ? ' in common' : ''}`;
    return { tab1Header, tab2Header };
  }, [snapshot.isApplicable, isCombination]);

  // force the component to re-render when any of the search input change, so that the tokens are reset and refetch
  const tokensKey = useMemo(
    () =>
      `${address.join(
        ','
      )}-${blockchainType}-${tokenType}-${sortOrder}-${activeSnapshotInfo}`,
    [address, blockchainType, tokenType, sortOrder, activeSnapshotInfo]
  );

  const renderFilterContent = () => {
    if (showTokenDetails) {
      return (
        <div className="flex justify-center w-[calc(100vw-20px)] sm:w-[645px]">
          <GetAPIDropdown options={options} />
        </div>
      );
    }
    return (
      <div className="flex justify-between w-[calc(100vw-20px)] sm:w-[645px]">
        <div className="flex-row-center gap-1">
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
        <GetAPIDropdown options={options} />
      </div>
    );
  };

  const renderViewContent = () => {
    if (showTokenDetails) {
      return (
        <TokenDetails
          {...token}
          hideBackBreadcrumb={hideBackBreadcrumb}
          key={activeTokenInfo}
          onClose={() => setData({ activeTokenInfo: '' })}
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
            <div className="mt-5 flex gap-5 mb-5 text-center sm:hidden border-b-4 border-solid border-stroke-color text-sm">
              <MobileTab
                icon="nft-flat"
                header={tab1Header}
                active={showSocials}
                onClick={() => setShowSocials(false)}
              />
              <MobileTab
                icon="erc20"
                header={tab2Header}
                active={!showSocials}
                onClick={() => setShowSocials(true)}
              />
            </div>
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
