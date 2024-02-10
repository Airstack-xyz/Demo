import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { AdvancedSettings } from '../../Components/Filters/AdvancedSettings';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import { defaultSortOrder } from '../../Components/Filters/SortBy';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Icon } from '../../Components/Icon';
import { getAllWordsAndMentions } from '../../Components/Input/utils';
import { Search } from '../../Components/Search';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { useSearchInput } from '../../hooks/useSearchInput';
import { SocialQuery } from '../../queries';
import {
  getCommonNftOwnersSnapshotQuery,
  getNftOwnersSnapshotQuery
} from '../../queries/Snapshots/commonNftOwnersSnapshotQuery';
import {
  getCommonNftOwnersSnapshotQueryWithFilters,
  getNftOwnersSnapshotQueryWithFilters
} from '../../queries/Snapshots/commonNftOwnersSnapshotQueryWithFilters';
import { accountOwnerQuery } from '../../queries/accountsQuery';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../../queries/commonNftOwnersQuery';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../queries/commonNftOwnersQueryWithFilters';
import { getCommonOwnersPOAPsQuery } from '../../queries/commonOwnersPOAPsQuery';
import { getCommonPoapAndNftOwnersQuery } from '../../queries/commonPoapAndNftOwnersQuery';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../queries/commonPoapAndNftOwnersQueryWithFilters';
import { getNftWithCommonOwnersQuery } from '../../queries/nftWithCommonOwnersQuery';
import { getFilterablePoapsQuery } from '../../queries/overviewDetailsPoap';
import {
  erc20TokenDetailsQuery,
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery
} from '../../queries/tokenDetails';
import { useTokenDetails } from '../../store/tokenDetails';
import {
  TokenHolder,
  useOverviewTokens
} from '../../store/tokenHoldersOverview';
import {
  checkBlockchainSupportForSnapshot,
  getActiveSnapshotInfo,
  getCSVDownloadSnapshotVariables,
  getSnapshotQueryFilters
} from '../../utils/activeSnapshotInfoString';
import { getActiveTokenInfo } from '../../utils/activeTokenInfoString';
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import { showToast } from '../../utils/showToast';
import { sortAddressByPoapFirst } from '../../utils/sortAddressByPoapFirst';
import { tokenTypes } from '../TokenBalances/constants';
import { HoldersOverview } from './Overview/Overview';
import { OverviewDetails } from './OverviewDetails/OverviewDetails';
import { getRequestFilters } from './OverviewDetails/Tokens/utils';
import { Tokens } from './Tokens/Tokens';
import { POAPSupplyQuery, TokenSupplyQuery } from '../../queries/supplyQuery';
import { CSVDownloadDropdown } from '../../Components/CSVDownload/CSVDownloadDropdown';
import { CSVDownloadOption } from '../../types';
import { CsvQueryType } from '../../../__generated__/types';
import { formatDate } from '../../utils';
import { useCsvDownloadOptions } from '../../store/csvDownload';

export function TokenHolders() {
  const [
    {
      rawInput,
      address: tokenAddress,
      resolve6551,
      activeView,
      tokenFilters,
      activeSnapshotInfo,
      activeTokenInfo
    },
    setData
  ] = useSearchInput();
  const [{ hasERC6551, owner, accountAddress }] = useTokenDetails([
    'hasERC6551',
    'owner',
    'accountAddress'
  ]);
  const [{ tokens: _overviewTokens }] = useOverviewTokens(['tokens']);
  const [showTokensOrOverview, setShowTokensOrOverview] = useState(true);

  const overviewTokens = _overviewTokens as TokenHolder[];

  const addressRef = useRef<null | string[]>(null);
  const isHome = !!useMatch('/');

  const query = tokenAddress?.length > 0 ? tokenAddress[0] : '';

  useEffect(() => {
    setShowTokensOrOverview(true);
  }, [tokenAddress]);

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

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

  const isCombination = tokenAddress.length > 1;

  const isResolve6551Enabled = resolve6551 === '1';

  const mentions = useMemo(() => {
    return getAllWordsAndMentions(rawInput).map(item => item.mention);
  }, [rawInput]);

  const addresses = useMemo(() => {
    return sortByAddressByNonERC20First(tokenAddress, overviewTokens, hasPoap);
  }, [hasPoap, tokenAddress, overviewTokens]);

  const requestFilters = useMemo(() => {
    return getRequestFilters(tokenFilters);
  }, [tokenFilters]);

  const tokenOwnersQuery = useMemo(() => {
    if (addresses.length === 0) return '';
    if (addresses.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQuery({
          tokenAddress: addresses[0],
          snapshotFilter: snapshotInfo.appliedFilter
        });
      }
      return getNftOwnersQuery({ tokenAddress: addresses[0] });
    }
    if (hasSomePoap) {
      const tokenAddresses = sortAddressByPoapFirst(addresses);
      return getCommonPoapAndNftOwnersQuery({
        poapAddress: tokenAddresses[0],
        tokenAddress: tokenAddresses[1]
      });
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQuery({
        tokenAddress1: addresses[0],
        tokenAddress2: addresses[1],
        snapshotFilter: snapshotInfo.appliedFilter
      });
    }
    return getCommonNftOwnersQuery({
      tokenAddress1: addresses[0],
      tokenAddress2: addresses[1]
    });
  }, [
    addresses,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter
  ]);

  const tokensQueryWithFilter = useMemo(() => {
    if (addresses.length === 0) return '';
    if (addresses.length === 1) {
      if (snapshotInfo.isApplicable) {
        return getNftOwnersSnapshotQueryWithFilters({
          tokenAddress: addresses[0],
          snapshotFilter: snapshotInfo.appliedFilter,
          ...requestFilters
        });
      }
      return getNftOwnersQueryWithFilters({
        tokenAddress: addresses[0],
        ...requestFilters
      });
    }
    if (hasSomePoap) {
      const tokenAddresses = sortAddressByPoapFirst(addresses);
      return getCommonPoapAndNftOwnersQueryWithFilters({
        poapAddress: tokenAddresses[0],
        tokenAddress: tokenAddresses[1],
        ...requestFilters
      });
    }
    if (snapshotInfo.isApplicable) {
      return getCommonNftOwnersSnapshotQueryWithFilters({
        tokenAddress1: addresses[0],
        tokenAddress2: addresses[1],
        snapshotFilter: snapshotInfo.appliedFilter,
        ...requestFilters
      });
    }
    return getCommonNftOwnersQueryWithFilters({
      tokenAddress1: addresses[0],
      tokenAddress2: addresses[1],
      ...requestFilters
    });
  }, [
    addresses,
    hasSomePoap,
    snapshotInfo.isApplicable,
    snapshotInfo.appliedFilter,
    requestFilters
  ]);

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

  const [options, csvDownloadOptions] = useMemo(() => {
    const csvDownloadOptions: CSVDownloadOption[] = [];
    if (overviewTokens.length === 0) return [[], []];
    let key: null | CSVDownloadOption['key'] = null;
    let variables: CSVDownloadOption['filters'] = undefined;
    let totalSupply = 0;
    const erc20Tokens = overviewTokens?.filter(v => v.tokenType === 'ERC20');
    const poaps = overviewTokens?.filter(v => !v.tokenAddress.startsWith('0x'));
    const nfts = overviewTokens?.filter(
      v => v.tokenAddress.startsWith('0x') && v.tokenType !== 'ERC20'
    );
    const socialFilters = {};
    const hasMultipleTokens = tokenAddress.length > 1;
    const hasERC20 = erc20Tokens?.length > 0;

    // for now there is no support for multiple ERC20 tokens
    if (hasMultipleTokens) {
      if (hasERC20) {
        totalSupply = erc20Tokens[0].holdersCount;
        variables = {
          erc20Address: erc20Tokens[0].tokenAddress,
          blockchain: erc20Tokens[0].blockchain
        };
        if (poaps.length > 0) {
          totalSupply = Math.max(poaps[0].holdersCount, totalSupply);
          key = CsvQueryType.Erc20PoapHolders;
          variables = {
            ...variables,
            eventId: poaps[0].tokenAddress
          };
        } else if (nfts.length > 0) {
          totalSupply = Math.max(nfts[0].holdersCount, totalSupply);
          key = CsvQueryType.NftErc20Holders;
          variables = {
            ...variables,
            nftAddress: nfts[0].tokenAddress
          };
        }
      } else if (poaps.length) {
        if (poaps.length === 1) {
          totalSupply = Math.max(poaps[0].holdersCount, nfts[0].holdersCount);
          key = CsvQueryType.PoapNftHolders;
          variables = {
            eventId: poaps[0].tokenAddress,
            tokenAddress: nfts[0].tokenAddress,
            blockchain: nfts[0].blockchain
          };
        } else {
          totalSupply = Math.max(poaps[0].holdersCount, poaps[1].holdersCount);
          key = CsvQueryType.CommonPoapHolders;
          variables = {
            eventId1: poaps[0].tokenAddress,
            eventId2: poaps[1].tokenAddress
          };
        }
      } else {
        totalSupply = Math.max(
          overviewTokens[0].holdersCount,
          overviewTokens[1].holdersCount
        );
        key = CsvQueryType.CommonNftHolders;
        variables = {
          tokenAddress1: overviewTokens[0].tokenAddress,
          tokenAddress2: overviewTokens[1].tokenAddress,
          blockchain: overviewTokens[0].blockchain || 'ethereum'
        };
      }

      if (key && variables) {
        const names: string[] = [];

        overviewTokens.forEach(token => {
          names.push(token.name);
        });

        const name = `Holders ${names.join(' & ')}`;
        const combinationsCSVDownloadOption: CSVDownloadOption = {
          label: name,
          key,
          fileName: `${name}.csv`,
          totalSupply,
          variables,
          filters: {
            ...socialFilters
          }
        };
        csvDownloadOptions.push(combinationsCSVDownloadOption);
      }
    } else {
      const tokenName = overviewTokens?.[0]?.name;
      if (poaps.length) {
        csvDownloadOptions.push({
          label: 'POAP Holders',
          key: CsvQueryType.PoapHolders,
          totalSupply: poaps[0].holdersCount,
          fileName: `Holders of ${tokenName}.csv`,
          variables: {
            eventId: poaps[0].tokenAddress // event id
          },
          filters: {
            ...socialFilters
          }
        });
      } else {
        if (snapshotInfo?.isApplicable) {
          const { name, value } = getCSVDownloadSnapshotVariables(snapshotInfo);
          let postFix = 'as of block ' + value;

          if (name === 'date' || name === 'timestamp') {
            postFix = 'as of ' + formatDate(value as string);
          }

          if (poaps.length === 0) {
            csvDownloadOptions.push({
              label: 'Nft holders',
              totalSupply: overviewTokens[0].holdersCount,
              key: hasERC20
                ? CsvQueryType.Erc20HoldersSnapshot
                : CsvQueryType.NftHoldersSnapshot,
              fileName: `Holders of ${tokenName} ${postFix}.csv`,
              variables: {
                tokenAddress: overviewTokens[0].tokenAddress,
                blockchain: overviewTokens[0].blockchain, // TODO: fix this it should be dynamic
                [name]: value
              },
              filters: {
                snapshotFilter: name,
                ...socialFilters
              }
            });
          }
        } else if (poaps.length === 0) {
          csvDownloadOptions.push({
            label: 'Nft holders',
            totalSupply: overviewTokens[0].holdersCount,
            key: hasERC20 ? CsvQueryType.Erc20Holders : CsvQueryType.NftHolders,
            fileName: `Holders of ${tokenName}.csv`,
            variables: {
              tokenAddress: overviewTokens[0].tokenAddress,
              blockchain: overviewTokens[0].blockchain // TODO: fix this it should be dynamic
            },
            filters: {
              ...socialFilters
            }
          });
        }
      }
    }

    if (activeView) {
      let combinationsQueryLink = '';
      if (hasPoap) {
        const combinationsQuery = getFilterablePoapsQuery({
          tokenAddresses: addresses,
          ...requestFilters
        });
        combinationsQueryLink = createAppUrlWithQuery(combinationsQuery, {
          limit: 200,
          ...requestFilters
        });
      } else {
        if (snapshotInfo.isApplicable) {
          const queryFilters = getSnapshotQueryFilters(snapshotInfo);
          combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
            limit: 200,
            ...queryFilters,
            ...requestFilters
          });
        } else {
          combinationsQueryLink = createAppUrlWithQuery(tokensQueryWithFilter, {
            limit: 200,
            ...requestFilters
          });
        }
      }

      return [
        [
          {
            label: 'Combinations',
            link: combinationsQueryLink
          }
        ],
        csvDownloadOptions
      ];
    }

    const options = [];

    if (!activeTokenInfo && !hasERC6551) {
      if (hasPoap) {
        const poapsQuery = getCommonOwnersPOAPsQuery({
          poapAddresses: addresses
        });

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
        if (snapshotInfo.isApplicable) {
          const queryFilters = getSnapshotQueryFilters(snapshotInfo);
          const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
            limit: 20,
            ...queryFilters
          });

          options.push({
            label: 'Token holders',
            link: tokenLink
          });
        } else {
          const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
            limit: 20
          });

          options.push({
            label: 'Token holders',
            link: tokenLink
          });

          const tokenSupplyLink = createAppUrlWithQuery(TokenSupplyQuery, {
            tokenAddress: query
          });

          options.push({
            label: 'Token supply',
            link: tokenSupplyLink
          });
        }
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

        const tokensQuery = getNftWithCommonOwnersQuery({
          owners: [accountAddress],
          blockchain: null
        });

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

    return [options, csvDownloadOptions];
  }, [
    addresses,
    overviewTokens,
    tokenAddress,
    activeView,
    activeTokenInfo,
    hasERC6551,
    query,
    hasPoap,
    requestFilters,
    snapshotInfo,
    tokensQueryWithFilter,
    tokenOwnersQuery,
    owner,
    token.tokenAddress,
    token.blockchain,
    token.tokenId,
    token.eventId,
    accountAddress
  ]);
  const setOptions = useCsvDownloadOptions(['options'])[1];
  useEffect(() => {
    setOptions({ options: csvDownloadOptions });
  }, [csvDownloadOptions, setOptions]);

  const { hasMultipleERC20, hasEveryERC20 } = useMemo(() => {
    const erc20Tokens = overviewTokens?.filter(v => v.tokenType === 'ERC20');
    const erc20Mentions = mentions?.filter(
      v => v?.token === 'ERC20' || v?.token === 'TOKEN'
    );
    const hasEveryERC20Token =
      overviewTokens?.length > 0 &&
      overviewTokens.every(v => v.tokenType === 'ERC20');
    const hasEveryERC20Mention =
      mentions?.length > 0 &&
      mentions.every(v => v?.token === 'ERC20' || v?.token === 'TOKEN');
    return {
      hasMultipleERC20: erc20Mentions?.length > 1 || erc20Tokens?.length > 1,
      hasEveryERC20: hasEveryERC20Mention || hasEveryERC20Token
    };
  }, [overviewTokens, mentions]);

  useEffect(() => {
    // ERC20 tokens have a large number of holders so we don't allow multiple ERC20 tokens to be searched at once
    if (hasMultipleERC20) {
      showToast('Try to combine ERC20 tokens with NFTs or POAPs', 'negative');
    }
  }, [hasMultipleERC20]);

  const handleInvalidAddress = useCallback(() => {
    setShowTokensOrOverview(false);
  }, []);

  // Hide Overview if:
  const hideOverview =
    isResolve6551Enabled || // Resolve 6551 switch is on
    snapshotInfo.isApplicable || // Snapshots are enabled
    hasEveryERC20 || // Has every ERC20 tokens
    hasMultipleERC20 || // Has ERC20 combinations
    !!activeView; // Summary for overview details is visible

  const showTokens =
    showTokensOrOverview && !hasMultipleERC20 && !activeTokenInfo;

  const isQueryExists = query && query.length > 0;

  // force the component to re-render when any of the search input change, so that the tokens are reset and refetch
  const tokensKey = useMemo(
    () => `${addresses}-${resolve6551}-${activeSnapshotInfo}`,
    [addresses, resolve6551, activeSnapshotInfo]
  );

  const {
    snapshotFilterTooltip,
    snapshotFilterTooltipIconHidden,
    snapshotFilterDisabled
  } = useMemo(() => {
    const isOverviewTokensLoading = overviewTokens?.length === 0;
    const blockchain = addresses?.[0]?.blockchain || mentions?.[0]?.blockchain;

    let snapshotFilterTooltip = '';
    let snapshotFilterTooltipIconHidden = false;
    let snapshotFilterDisabled = false;

    if (isOverviewTokensLoading) {
      if (!blockchain) {
        snapshotFilterTooltip = 'Please wait until the loading takes place';
        snapshotFilterTooltipIconHidden = true;
        snapshotFilterDisabled = true;
      } else if (
        !isCombination &&
        !checkBlockchainSupportForSnapshot(blockchain)
      ) {
        snapshotFilterDisabled = true;
      }
    } else if (
      blockchain &&
      !isCombination &&
      !checkBlockchainSupportForSnapshot(blockchain)
    ) {
      snapshotFilterDisabled = true;
    }
    if (hasPoap || isCombination) {
      snapshotFilterDisabled = true;
    }
    return {
      snapshotFilterTooltip,
      snapshotFilterTooltipIconHidden,
      snapshotFilterDisabled
    };
  }, [addresses, hasPoap, isCombination, mentions, overviewTokens?.length]);

  const renderFilterContent = () => {
    if (activeTokenInfo) {
      return (
        <div className="flex justify-center gap-3.5 w-full">
          <GetAPIDropdown options={options} />
        </div>
      );
    }

    return (
      <div className="flex justify-between w-full">
        <div className="flex-row-center gap-3.5">
          <SnapshotFilter
            disabled={snapshotFilterDisabled}
            disabledTooltipText={snapshotFilterTooltip}
            disabledTooltipIconHidden={snapshotFilterTooltipIconHidden}
          />
          <AdvancedSettings />
        </div>
        <div className="flex items-center gap-3.5">
          <GetAPIDropdown options={options} />
          <CSVDownloadDropdown options={csvDownloadOptions} />
        </div>
      </div>
    );
  };

  return (
    <div
      className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
        'flex-1 h-full w-full flex flex-col !pt-[12vw] items-center text-center':
          isHome
      })}
    >
      <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
        {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
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
            {/* 
                Overview token fetching happen inside HoldersOverview, that's 
                why it is need to be mounted every time, even if we don't show ui 
                TODO: Move overview fetching logic outside 
               */}
            <HoldersOverview
              hideOverview={hideOverview}
              onAddress404={handleInvalidAddress}
            />
            {showTokens && (
              <>
                {activeView && <OverviewDetails />}
                {!activeView && (
                  <div key={tokensKey}>
                    <div className="flex mb-4">
                      <Icon name="token-holders" height={20} width={20} />{' '}
                      <span className="font-bold ml-1.5 text-sm">Holders</span>
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
  );
}
