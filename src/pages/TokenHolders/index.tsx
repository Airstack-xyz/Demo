import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/Layout';
import { Tokens } from './Tokens/Tokens';
import { HoldersOverview } from './Overview/Overview';
import { useSearchInput } from '../../hooks/useSearchInput';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { SocialQuery, TokenTotalSupplyQuery } from '../../queries';
import classNames from 'classnames';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Icon } from '../../Components/Icon';
import { OverviewDetails } from './OverviewDetails/OverviewDetails';
import { getRequestFilters } from './OverviewDetails/Tokens/filters';
import { POAPSupplyQuery } from '../../queries/overviewDetailsTokens';
import { getFilterablePoapsQuery } from '../../queries/overviewDetailsPoap';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../../queries/commonNftOwnersQuery';
import { sortAddressByPoapFirst } from '../../utils/sortAddressByPoapFirst';
import { getCommonPoapAndNftOwnersQuery } from '../../queries/commonPoapAndNftOwnersQuery';
import { createCommonOwnersPOAPsQuery } from '../../queries/commonOwnersPOAPsQuery';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../queries/commonNftOwnersQueryWithFilters';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../queries/commonPoapAndNftOwnersQueryWithFilters';
import { useMatch } from 'react-router-dom';
import {
  useOverviewTokens,
  TokenHolder
} from '../../store/tokenHoldersOverview';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import {
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery,
  erc20TokenDetailsQuery
} from '../../queries/tokenDetails';
import { useTokenDetails } from '../../store/tokenDetails';
import { createNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { tokenTypes } from '../TokenBalances/constants';
import { accountOwnerQuery } from '../../queries/accountsQuery';
import { getActiveTokenInfo } from '../../utils/activeTokenInfoString';
import { defaultSortOrder } from '../../Components/Filters/SortBy';
import { getAllWordsAndMentions } from '../../Components/Input/utils';

export function TokenHolders() {
  const [
    {
      rawInput,
      address: tokenAddress,
      activeView,
      tokenFilters,
      activeTokenInfo
    },
    setData
  ] = useSearchInput();
  const [{ hasERC6551, owner, accountAddress }] = useTokenDetails([
    'hasERC6551',
    'owner',
    'accountAddress'
  ]);
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);
  const [showTokensOrOverview, setShowTokensOrOverview] = useState(true);

  const addressRef = useRef<null | string[]>(null);
  const isHome = useMatch('/');

  const query = tokenAddress.length > 0 ? tokenAddress[0] : '';

  useEffect(() => {
    setShowTokensOrOverview(true);
  }, [tokenAddress]);

  const tokensKey = useMemo(() => tokenAddress.join(','), [tokenAddress]);

  useEffect(() => {
    // go to token-holders page if user input address has changed
    if (addressRef.current && addressRef.current !== tokenAddress) {
      setData(
        {
          activeView: '',
          activeTokenInfo: ''
        },
        {
          updateQueryParams: true
        }
      );
    }
    addressRef.current = tokenAddress;
  }, [tokenAddress, setData]);

  const hasSomePoap = tokenAddress.some(token => !token.startsWith('0x'));
  const hasPoap = tokenAddress.every(token => !token.startsWith('0x'));

  const { hasERC20Mention } = useMemo(() => {
    const mentions = getAllWordsAndMentions(rawInput).map(item => item.mention);
    const hasERC20Mention =
      mentions?.every(
        item => item?.token === 'ERC20' || item?.token === 'TOKEN'
      ) ?? false;
    return {
      mentions,
      hasERC20Mention
    };
  }, [rawInput]);

  const address = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const tokenOwnersQuery = useMemo(() => {
    if (address.length === 0) return '';
    if (address.length === 1) {
      return getNftOwnersQuery(address[0].address);
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQuery(tokens[0], tokens[1]);
    }
    return getCommonNftOwnersQuery(address[0], address[1]);
  }, [address, hasSomePoap]);

  const tokensQueryWithFilter = useMemo(() => {
    const requestFilters = getRequestFilters(tokenFilters);
    const hasSocialFilters = Boolean(requestFilters?.socialFilters);
    const hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
    if (address.length === 0) return '';
    if (address.length === 1) {
      return getNftOwnersQueryWithFilters(
        address[0].address,
        hasSocialFilters,
        hasPrimaryDomain
      );
    }
    if (hasSomePoap) {
      const tokens = sortAddressByPoapFirst(address);
      return getCommonPoapAndNftOwnersQueryWithFilters(
        tokens[0],
        tokens[1],
        hasSocialFilters,
        hasPrimaryDomain
      );
    }
    return getCommonNftOwnersQueryWithFilters(
      address[0],
      address[1],
      hasSocialFilters,
      hasPrimaryDomain
    );
  }, [tokenFilters, address, hasSomePoap]);

  const token = useMemo(() => {
    const { tokenAddress, tokenId, blockchain, eventId } =
      getActiveTokenInfo(activeTokenInfo);
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  }, [activeTokenInfo]);

  const options = useMemo(() => {
    if (address.length === 0) return [];

    if (activeView) {
      const requestFilters = getRequestFilters(tokenFilters);
      const hasSocialFilters = Boolean(requestFilters?.socialFilters);
      const hasPrimaryDomain = requestFilters?.hasPrimaryDomain;
      let combinationsQueryLink = '';
      if (hasPoap) {
        const combinationsQuery = getFilterablePoapsQuery(
          address,
          hasSocialFilters,
          hasPrimaryDomain
        );
        combinationsQueryLink = createAppUrlWithQuery(combinationsQuery, {
          limit: 200,
          ...requestFilters
        });
      } else {
        combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
          limit: 200,
          ...requestFilters
        });
      }
      return [
        {
          label: 'Combinations',
          link: combinationsQueryLink
        }
      ];
    }

    const options = [];

    if (!activeTokenInfo && !hasERC6551) {
      if (hasPoap) {
        const poapsQuery = createCommonOwnersPOAPsQuery(address);

        const poapLink = createAppUrlWithQuery(poapsQuery, {
          limit: 20
        });

        const poapSupplyLink = createAppUrlWithQuery(POAPSupplyQuery, {
          eventId: query
        });

        options.push({
          label: 'POAP holders',
          link: poapLink
        });

        options.push({
          label: 'POAP supply',
          link: poapSupplyLink
        });
      } else {
        const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
          limit: 20
        });

        options.push({
          label: 'Token holders',
          link: tokenLink
        });

        const tokenSupplyLink = createAppUrlWithQuery(TokenTotalSupplyQuery, {
          tokenAddress: query
        });

        options.push({
          label: 'Token supply',
          link: tokenSupplyLink
        });
      }
    }

    if (hasERC6551 && !activeTokenInfo) {
      const socialLink = createAppUrlWithQuery(SocialQuery, {
        identity: owner
      });
      options.push({
        label: 'Socials, Domains & XMTP',
        link: socialLink
      });

      const accountHolderLink = createAppUrlWithQuery(accountOwnerQuery, {
        accountAddress: tokenAddress[0]
      });

      options.push({
        label: 'Account Holder',
        link: accountHolderLink
      });
    }

    if (activeTokenInfo) {
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

        const tokensQuery = createNftWithCommonOwnersQuery(
          [accountAddress],
          null
        );

        const nftLink = createAppUrlWithQuery(tokensQuery, {
          limit: 10,
          sortBy: defaultSortOrder,
          tokenType: tokenTypes
        });

        options.push({
          label: 'Token Balances (NFT)',
          link: nftLink
        });
      }
    }

    return options;
  }, [
    accountAddress,
    activeTokenInfo,
    activeView,
    address,
    hasERC6551,
    owner,
    query,
    token.blockchain,
    token.eventId,
    token.tokenAddress,
    token.tokenId,
    tokenAddress,
    tokenFilters,
    hasPoap,
    tokenOwnersQuery,
    tokensQueryWithFilter
  ]);

  const hasMultipleERC20 = useMemo(() => {
    const erc20Tokens = overviewTokens.filter(
      (token: TokenHolder) => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [overviewTokens]);

  const handleInvalidAddress = useCallback(() => {
    setShowTokensOrOverview(false);
  }, []);

  const showInCenter = isHome;

  // Don't show summary for ERC20 token
  const showSummary = !hasERC20Mention;

  const showTokens =
    showTokensOrOverview && !hasMultipleERC20 && !activeTokenInfo;

  const isQueryExists = query && query.length > 0;

  const renderFilterContent = () => {
    return (
      <div className="flex justify-center w-full">
        <GetAPIDropdown
          options={options}
          disabled={overviewTokens.length === 0}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div
        className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
          'flex-1 h-full w-full flex flex-col translate-y-[10vw] items-center text-center':
            isHome
        })}
      >
        <div className="max-w-[645px] mx-auto w-full">
          {showInCenter && (
            <h1 className="text-[2rem]">Explore web3 identities</h1>
          )}
          <Search />
          {!hasMultipleERC20 && isQueryExists && (
            <div className="m-3 flex-row-center">{renderFilterContent()}</div>
          )}
        </div>
        {isQueryExists && (
          <>
            <div
              className="flex flex-col justify-center mt-7 max-w-[950px] mx-auto"
              key={query}
            >
              {showSummary && (
                <HoldersOverview onAddress404={handleInvalidAddress} />
              )}
              {showTokens && (
                <>
                  {activeView && <OverviewDetails />}
                  {!activeView && (
                    <div key={tokensKey}>
                      <div className="flex mb-4">
                        <Icon name="token-holders" height={20} width={20} />{' '}
                        <span className="font-bold ml-1.5 text-sm">
                          Holders
                        </span>
                      </div>
                      <Tokens />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
