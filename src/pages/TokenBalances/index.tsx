import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
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
import { defaultSortOrder } from './SortBy';
import { createNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { poapsOfCommonOwnersQuery } from '../../queries/poapsOfCommonOwnersQuery';
import { useMatch } from 'react-router-dom';
import { TokenBalancesLoaderWithInfo } from './TokenBalancesLoaderWithInfo';
import { TokenDetails } from './ERC6551/TokenDetails';
import { useGetAccountOwner } from '../../hooks/useGetAccountOwner';
import { activeTokenInfoString } from '../../utils/activeTokenInfoString';

const SocialsAndERC20 = memo(function SocialsAndERC20() {
  const [{ address, tokenType, blockchainType, sortOrder }] = useSearchInput();
  // force the component to re-render when any of the search input change, so that the ERC20 can reset, refetched
  const erc20Key = useMemo(
    () => `${address.join(',')}-${blockchainType}-${tokenType}-${sortOrder}`,
    [address, blockchainType, sortOrder, tokenType]
  );

  return (
    <aside className="w-full min-w-full sm:w-[305px] sm:min-w-[305px] sm:ml-16">
      {address.length <= 1 && (
        <>
          <Socials />
          <div className="mt-11"></div>
        </>
      )}
      <ERC20Tokens key={erc20Key} />
    </aside>
  );
});

function TokenContainer({ loading }: { loading: boolean }) {
  const [{ address, tokenType, blockchainType, sortOrder }] = useSearchInput();
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
    />
  );
}

export function TokenBalance() {
  const [
    { address, tokenType, blockchainType, sortOrder, activeTokenInfo },
    setData
  ] = useSearchInput();
  const [fetchAccountsOwner, account, loadingAccount] = useGetAccountOwner(
    address[0]
  );
  const query = address.length > 0 ? address[0] : '';
  const isHome = useMatch('/');

  const [showSocials, setShowSocials] = useState(false);
  const isMobile = isMobileDevice();

  useEffect(() => {
    if ((activeTokenInfo && address.length === 0) || address.length > 1) return;
    fetchAccountsOwner();
  }, [activeTokenInfo, address, fetchAccountsOwner]);

  const options = useMemo(() => {
    if (address.length === 0) return [];
    const fetchAllBlockchains =
      blockchainType.length === 2 || blockchainType.length === 0;

    const tokensQuery = createNftWithCommonOwnersQuery(
      address,
      fetchAllBlockchains ? null : blockchainType[0]
    );

    const nftLink = createAppUrlWithQuery(tokensQuery, {
      limit: 10,
      sortBy: sortOrder ? sortOrder : defaultSortOrder,
      tokenType: tokenType
        ? [tokenType]
        : tokenTypes.filter(tokenType => tokenType !== 'POAP')
    });

    const erc20Link = createAppUrlWithQuery(tokensQuery, {
      limit: 50,
      sortBy: sortOrder ? sortOrder : defaultSortOrder,
      tokenType: ['ERC20']
    });

    const poapsQuery = poapsOfCommonOwnersQuery(address);

    const poapLink = createAppUrlWithQuery(poapsQuery, {
      limit: 10,
      sortBy: sortOrder ? sortOrder : defaultSortOrder
    });

    const socialLink = createAppUrlWithQuery(SocialQuery, {
      identity: query
    });

    const options = [];

    if (!tokenType || tokenType === 'POAP') {
      options.push({
        label: 'POAPs',
        link: poapLink
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

    if (address.length === 1) {
      options.push({
        label: 'Socials, Domains & XMTP',
        link: socialLink
      });
    }

    return options;
  }, [address, blockchainType, query, sortOrder, tokenType]);

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
          <SectionHeader
            iconName="nft-flat"
            heading={`NFTs & POAPs${address.length > 1 ? ' in common' : ''}`}
          />
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
          <SectionHeader
            iconName="erc20"
            heading={`${address.length === 1 ? 'Socials & ' : ''}ERC20${
              address.length > 1 ? ' in common' : ''
            }`}
          />
        </div>
      </div>
    );
  }, [address.length, showSocials]);

  // force the component to re-render when any of the search input change, so that the tokens are reset and refetched
  const tokensKey = useMemo(
    () => `${address.join(',')}-${blockchainType}-${tokenType}-${sortOrder}`,
    [address, blockchainType, sortOrder, tokenType]
  );
  const showInCenter = isHome;

  const token = useMemo(() => {
    const [tokenAddress, tokenId, blockchain, eventId] =
      activeTokenInfo.split(' ');
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  }, [activeTokenInfo]);

  useEffect(() => {
    if (account && !activeTokenInfo) {
      // if address is of an account, set the active token info, to show the token details
      const _activeTokenInfo = activeTokenInfoString(
        account.tokenAddress,
        account.tokenId,
        account.blockchain
      );
      setData(
        {
          activeTokenInfo: _activeTokenInfo
        },
        { updateQueryParams: true }
      );
    }
  }, [account, activeTokenInfo, setData]);

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
            <div className="hidden sm:flex-col-center my-3">
              <GetAPIDropdown options={options} />
            </div>
            {activeTokenInfo ? (
              <TokenDetails
                {...token}
                key={activeTokenInfo}
                onClose={() => setData({ activeTokenInfo: '' })}
              />
            ) : (
              <div className="flex justify-between px-5">
                <div className="w-full h-full" key={query}>
                  <div className="hidden sm:block">
                    <SectionHeader
                      iconName="nft-flat"
                      heading={`NFTs & POAPs${
                        address.length > 1 ? ' in common' : ''
                      }`}
                    />
                  </div>
                  {isMobile && renderMobileTabs()}
                  <div className="mt-3.5 mb-5">
                    {(!isMobile || !showSocials) && <Filters />}
                  </div>
                  {isMobile ? (
                    showSocials ? (
                      <SocialsAndERC20 />
                    ) : (
                      <TokenContainer
                        key={tokensKey}
                        loading={loadingAccount}
                      />
                    )
                  ) : (
                    <TokenContainer key={tokensKey} loading={loadingAccount} />
                  )}
                </div>
                {!isMobile && <SocialsAndERC20 />}
              </div>
            )}
          </>
        )}
      </div>
      {!activeTokenInfo && <TokenBalancesLoaderWithInfo />}
    </Layout>
  );
}
