import { memo, useCallback, useMemo, useState } from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { Socials } from './Socials';
import { Tokens } from './Tokens';
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

const SocialsAndERC20 = memo(function SocialsAndERC20() {
  const [
    {
      address,
      tokenType,
      blockchainType,
      sortOrder,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    }
  ] = useSearchInput();

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );

  // Force the component to re-render when any of the search input change, so that the ERC20 can reset, refetch
  const erc20Key = useMemo(
    () =>
      `${address.join(
        ','
      )}-${blockchainType}-${tokenType}-${sortOrder}-${snapshotBlockNumber}-${snapshotDate}-${snapshotTimestamp}`,
    [
      address,
      blockchainType,
      sortOrder,
      tokenType,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    ]
  );

  return (
    <aside className="w-full min-w-full sm:w-[305px] sm:min-w-[305px] sm:ml-16">
      {address.length <= 1 && !isSnapshotQuery && (
        <>
          <Socials />
          <div className="mt-11"></div>
        </>
      )}
      <ERC20Tokens key={erc20Key} />
    </aside>
  );
});

export function TokenBalance() {
  const [
    {
      address,
      tokenType,
      blockchainType,
      sortOrder,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    }
  ] = useSearchInput();
  const isHome = useMatch('/');
  const [showSocials, setShowSocials] = useState(false);
  const isMobile = isMobileDevice();

  const query = address.length > 0 ? address[0] : '';

  const isSnapshotQuery = Boolean(
    snapshotBlockNumber || snapshotDate || snapshotTimestamp
  );
  const isCombination = address.length > 1;

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

    if (!isSnapshotQuery && (!tokenType || tokenType === 'POAP')) {
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

    if (isSnapshotQuery) {
      const tokensQuery = createNftWithCommonOwnersSnapshotQuery({
        owners: address,
        blockchain: _blockchain,
        blockNumber: snapshotBlockNumber,
        date: snapshotDate,
        timestamp: snapshotTimestamp
      });

      nftLink = createAppUrlWithQuery(tokensQuery, {
        limit: 10,
        tokenType: _limit,
        blockNumber: snapshotBlockNumber,
        date: snapshotDate,
        timestamp: snapshotTimestamp
      });

      erc20Link = createAppUrlWithQuery(tokensQuery, {
        limit: 50,
        tokenType: ['ERC20'],
        blockNumber: snapshotBlockNumber,
        date: snapshotDate,
        timestamp: snapshotTimestamp
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

    if (tokenType !== 'POAP') {
      options.push({
        label: 'Token Balances (NFT)',
        link: nftLink
      });
    }

    options.push({
      label: 'Token Balances (ERC20)',
      link: erc20Link
    });

    if (!isSnapshotQuery && address.length === 1) {
      const socialLink = createAppUrlWithQuery(SocialQuery, {
        identity: query
      });

      options.push({
        label: 'Socials, Domains & XMTP',
        link: socialLink
      });
    }

    return options;
  }, [
    query,
    address,
    blockchainType,
    sortOrder,
    tokenType,
    isSnapshotQuery,
    snapshotBlockNumber,
    snapshotDate,
    snapshotTimestamp
  ]);

  const { tab1Header, tab2Header } = useMemo(() => {
    const tab1Header = `${isSnapshotQuery ? 'NFTs' : 'NFTs & POAPs'}${
      isCombination ? ' in common' : ''
    }`;
    const tab2Header = `${isSnapshotQuery ? 'ERC20' : 'Socials & ERC20'}${
      isCombination ? ' in common' : ''
    }`;
    return { tab1Header, tab2Header };
  }, [isCombination, isSnapshotQuery]);

  const renderMobileTabs = useCallback(() => {
    return (
      <div className="mt-5 flex gap-5 mb-5 text-center sm:hidden border-b-4 border-solid border-stroke-color text-sm">
        <div
          onClick={() => setShowSocials(false)}
          className={classNames(
            'pb-2 flex-1 flex justify-center border-b-4 border-solid border-text-secondary -mb-1',
            {
              '!border-transparent [&>div]:font-normal  text-text-secondary':
                showSocials
            }
          )}
        >
          <SectionHeader iconName="nft-flat" heading={tab1Header} />
        </div>
        <div
          onClick={() => setShowSocials(true)}
          className={classNames(
            'pb-2 flex-1 flex justify-center border-b-4 border-solid border-text-secondary -mb-1',
            {
              '!border-transparent [&>div]:font-normal text-text-secondary':
                !showSocials
            }
          )}
        >
          <SectionHeader iconName="erc20" heading={tab2Header} />
        </div>
      </div>
    );
  }, [showSocials, tab1Header, tab2Header]);

  // Force the component to re-render when any of the search input change, so that the tokens are reset and refetch
  const tokensKey = useMemo(
    () =>
      `${address.join(
        ','
      )}-${blockchainType}-${tokenType}-${sortOrder}-${snapshotBlockNumber}-${snapshotDate}-${snapshotTimestamp}`,
    [
      address,
      blockchainType,
      sortOrder,
      tokenType,
      snapshotBlockNumber,
      snapshotDate,
      snapshotTimestamp
    ]
  );

  const showInCenter = isHome;

  return (
    <Layout>
      <div
        className={classNames(
          'flex flex-col px-2 pt-5 w-[1440px] max-w-[100vw] sm:pt-8',
          {
            'flex-1 h-full w-full flex flex-col items-center !pt-[30%] text-center':
              showInCenter
          }
        )}
      >
        <div className="flex flex-col items-center">
          {showInCenter && (
            <h1 className="text-[2rem]">Explore web3 identities</h1>
          )}
          <Search />
        </div>
        {query && query.length > 0 && (
          <>
            <div className="m-3 flex-row-center">
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
            </div>
            <div className="flex justify-between px-2 sm:px-5">
              <div className="w-full h-full" key={query}>
                <div className="hidden sm:block">
                  <SectionHeader iconName="nft-flat" heading={tab1Header} />
                </div>
                {isMobile && renderMobileTabs()}
                <div className="mt-3.5 mb-5">
                  {(!isMobile || !showSocials) && <Filters />}
                </div>
                {isMobile ? (
                  showSocials ? (
                    <SocialsAndERC20 />
                  ) : (
                    <Tokens key={tokensKey} />
                  )
                ) : (
                  <Tokens key={tokensKey} />
                )}
              </div>
              {!isMobile && <SocialsAndERC20 />}
            </div>
          </>
        )}
      </div>
      <TokenBalancesLoaderWithInfo />
    </Layout>
  );
}
