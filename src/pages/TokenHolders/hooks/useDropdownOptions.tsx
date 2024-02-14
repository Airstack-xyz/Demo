import { useMemo } from 'react';
import { CsvQueryType } from '../../../../__generated__/types';
import { defaultSortOrder } from '../../../Components/Filters/SortBy';
import { Option } from '../../../Components/GetAPIDropdown';
import { SocialQuery } from '../../../queries';
import {
  getCommonNftOwnersSnapshotQuery,
  getNftOwnersSnapshotQuery
} from '../../../queries/Snapshots/commonNftOwnersSnapshotQuery';
import {
  getCommonNftOwnersSnapshotQueryWithFilters,
  getNftOwnersSnapshotQueryWithFilters
} from '../../../queries/Snapshots/commonNftOwnersSnapshotQueryWithFilters';
import { accountOwnerQuery } from '../../../queries/accountsQuery';
import {
  getCommonNftOwnersQuery,
  getNftOwnersQuery
} from '../../../queries/commonNftOwnersQuery';
import {
  getCommonNftOwnersQueryWithFilters,
  getNftOwnersQueryWithFilters
} from '../../../queries/commonNftOwnersQueryWithFilters';
import { getCommonOwnersPOAPsQuery } from '../../../queries/commonOwnersPOAPsQuery';
import { getCommonPoapAndNftOwnersQuery } from '../../../queries/commonPoapAndNftOwnersQuery';
import { getCommonPoapAndNftOwnersQueryWithFilters } from '../../../queries/commonPoapAndNftOwnersQueryWithFilters';
import { getNftWithCommonOwnersQuery } from '../../../queries/nftWithCommonOwnersQuery';
import { getFilterablePoapsQuery } from '../../../queries/overviewDetailsPoap';
import {
  POAPSupplyQuery,
  TokenSupplyQuery
} from '../../../queries/supplyQuery';
import {
  erc20TokenDetailsQuery,
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery
} from '../../../queries/tokenDetails';
import { TokenHolder } from '../../../store/tokenHoldersOverview';
import { CSVDownloadOption } from '../../../types';
import { formatDate } from '../../../utils';
import {
  SnapshotInfo,
  getCSVDownloadSnapshotVariables,
  getSnapshotQueryFilters
} from '../../../utils/activeSnapshotInfoString';
import { TokenInfo } from '../../../utils/activeTokenInfoString';
import { createAppUrlWithQuery } from '../../../utils/createAppUrlWithQuery';
import { sortAddressByPoapFirst } from '../../../utils/sortAddressByPoapFirst';
import { tokenTypes } from '../../TokenBalances/constants';
import { getRequestFilters } from '../OverviewDetails/Tokens/utils';
import { TokenAddress } from '../types';

export function useDropdownOptions({
  addresses,
  overviewTokens,
  tokenAddress,
  activeView,
  activeTokenInfo,
  hasERC6551,
  query,
  hasPoap,
  hasSomePoap,
  tokenFilters,
  snapshotInfo,
  owner,
  tokenInfo,
  accountAddress
}: {
  addresses: TokenAddress[];
  overviewTokens: TokenHolder[];
  tokenAddress: string[];
  activeView: string;
  activeTokenInfo: string;
  hasERC6551: boolean;
  query: string;
  hasPoap: boolean;
  hasSomePoap: boolean;
  tokenFilters: string[];
  snapshotInfo: SnapshotInfo;
  owner: string;
  tokenInfo: TokenInfo;
  accountAddress: string;
}) {
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

  return useMemo(() => {
    if (overviewTokens.length === 0) return [[], []];

    const getAPIOptions: Option[] = [];
    const csvDownloadOptions: CSVDownloadOption[] = [];

    let key: null | CSVDownloadOption['key'] = null;
    let variables: CSVDownloadOption['filters'] = undefined;
    let totalSupply = 0;

    const erc20s = overviewTokens?.filter(v => v.tokenType === 'ERC20');
    const poaps = overviewTokens?.filter(v => !v.tokenAddress.startsWith('0x'));
    const nfts = overviewTokens?.filter(
      v => v.tokenAddress.startsWith('0x') && v.tokenType !== 'ERC20'
    );

    const socialFilters = {};
    const hasMultipleTokens = tokenAddress.length > 1;
    const hasERC20 = erc20s?.length > 0;

    // for now there is no support for multiple ERC20 tokens
    if (hasMultipleTokens) {
      if (hasERC20) {
        totalSupply = erc20s[0].holdersCount;
        variables = {
          erc20Address: erc20s[0].tokenAddress,
          blockchain: erc20s[0].blockchain
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
          fileName: `${name}`,
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
          fileName: `Holders of ${tokenName}`,
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
              label: 'Token holders',
              totalSupply: overviewTokens[0].holdersCount,
              key: hasERC20
                ? CsvQueryType.Erc20HoldersSnapshot
                : CsvQueryType.NftHoldersSnapshot,
              fileName: `Holders of ${tokenName} ${postFix}`,
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
            label: 'Token holders',
            totalSupply: overviewTokens[0].holdersCount,
            key: hasERC20 ? CsvQueryType.Erc20Holders : CsvQueryType.NftHolders,
            fileName: `Holders of ${tokenName}`,
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

    // Overview details page options =============================
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

      getAPIOptions.push({
        label: 'Combinations',
        link: combinationsQueryLink
      });
    }
    // Token details page options ================================
    else if (activeTokenInfo) {
      const erc6551AccountsQueryLink = createAppUrlWithQuery(
        erc6551TokensQuery,
        {
          tokenAddress: tokenInfo.tokenAddress,
          blockchain: tokenInfo.blockchain,
          tokenId: tokenInfo.tokenId
        }
      );

      const poapDetailsQueryLink = createAppUrlWithQuery(poapDetailsQuery, {
        tokenAddress: tokenInfo.tokenAddress,
        eventId: tokenInfo.eventId
      });

      const tokenDetailsQueryLink = createAppUrlWithQuery(tokenDetailsQuery, {
        tokenAddress: tokenInfo.tokenAddress,
        blockchain: tokenInfo.blockchain,
        tokenId: tokenInfo.tokenId
      });

      const erc20DetailsQueryLink = createAppUrlWithQuery(
        erc20TokenDetailsQuery,
        {
          tokenAddress: tokenInfo.tokenAddress,
          blockchain: tokenInfo.blockchain,
          tokenId: tokenInfo.tokenId
        }
      );

      if (tokenInfo?.eventId) {
        getAPIOptions.push({
          label: 'POAP Details',
          link: poapDetailsQueryLink
        });
      } else {
        getAPIOptions.push({
          label: 'Token Details',
          link: tokenInfo?.tokenId
            ? tokenDetailsQueryLink
            : erc20DetailsQueryLink
        });
      }

      if (hasERC6551) {
        getAPIOptions.push({
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

        getAPIOptions.push({
          label: 'Token Balances (NFT)',
          link: nftLink
        });
      }
    }
    // ERC6551 details page options ==============================
    else if (hasERC6551) {
      const socialLink = createAppUrlWithQuery(SocialQuery, {
        identity: owner
      });

      getAPIOptions.push({
        label: 'Socials, Domains & XMTP',
        link: socialLink
      });

      const accountHolderLink = createAppUrlWithQuery(accountOwnerQuery, {
        accountAddress: tokenAddress[0]
      });

      getAPIOptions.push({
        label: 'Account Holder',
        link: accountHolderLink
      });
    }
    // Tokens page options =======================================
    else {
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

        getAPIOptions.push({
          label: 'POAP holders',
          link: poapLink
        });

        getAPIOptions.push({
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

          getAPIOptions.push({
            label: 'Token holders',
            link: tokenLink
          });
        } else {
          const tokenLink = createAppUrlWithQuery(tokenOwnersQuery, {
            limit: 20
          });

          getAPIOptions.push({
            label: 'Token holders',
            link: tokenLink
          });

          const tokenSupplyLink = createAppUrlWithQuery(TokenSupplyQuery, {
            tokenAddress: query
          });

          getAPIOptions.push({
            label: 'Token supply',
            link: tokenSupplyLink
          });
        }
      }
    }

    return [getAPIOptions, csvDownloadOptions] as const;
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
    tokenInfo.tokenAddress,
    tokenInfo.blockchain,
    tokenInfo.tokenId,
    tokenInfo.eventId,
    accountAddress
  ]);
}
