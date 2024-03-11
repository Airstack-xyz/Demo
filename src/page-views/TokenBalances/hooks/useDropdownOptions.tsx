import { useMemo } from 'react';
import { defaultSortOrder } from '../../../Components/Filters/SortBy';
import { MentionType } from '../../../Components/Input/types';
import { getUsableValues } from '../../../Components/Input/utils';
import { SocialQuery, SocialOverlapQuery } from '../../../queries';
import { getNftWithCommonOwnersSnapshotQuery } from '../../../queries/Snapshots/nftWithCommonOwnersSnapshotQuery';
import { domainDetailsQuery } from '../../../queries/domainDetails';
import { getNftWithCommonOwnersQuery } from '../../../queries/nftWithCommonOwnersQuery';
import { poapsOfCommonOwnersQuery } from '../../../queries/poapsOfCommonOwnersQuery';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { getSocialFollowersQuery } from '../../../queries/socialFollowersQuery';
import { getSocialFollowingsQuery } from '../../../queries/socialFollowingQuery';
import {
  erc6551TokensQuery,
  poapDetailsQuery,
  tokenDetailsQuery,
  erc20TokenDetailsQuery
} from '../../../queries/tokenDetails';
import { CSVDownloadOption } from '../../../types';
import { capitalizeFirstLetter, formatDate } from '../../../utils';
import {
  getSnapshotQueryFilters,
  getCSVDownloadSnapshotVariables,
  SnapshotInfo
} from '../../../utils/activeSnapshotInfoString';
import { createAppUrlWithQuery } from '../../../utils/createAppUrlWithQuery';
import { getSocialFollowFilterData } from '../SocialDetails/utils';
import { CsvQueryType } from '../../../../__generated__/types';
import { SocialInfo } from '../../../utils/activeSocialInfoString';
import { TokenInfo } from '../../../utils/activeTokenInfoString';
import { ENSInfo } from '../../../utils/activeENSInfoString';
import { Option } from '../../../Components/GetAPIDropdown';

export function useDropdownOptions({
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
}: {
  socialInfo: SocialInfo;
  address: string[];
  hasERC6551: boolean;
  accountAddress: string;
  blockchainType: string[];
  mintFilter: string;
  sortOrder: string;
  tokenType: string;
  showTokenDetails: boolean;
  tokenInfo: TokenInfo;
  ensInfo: ENSInfo;
  snapshotInfo: SnapshotInfo;
}) {
  return useMemo(() => {
    if (address.length === 0) return [[], []];

    const detailTokensVisible = hasERC6551 && accountAddress;

    const fetchAllBlockchains = blockchainType?.length === 0;

    const isMintFilteringEnabled = mintFilter === '1';

    const owners = detailTokensVisible ? [accountAddress] : address;
    const blockchain = fetchAllBlockchains ? null : blockchainType[0];
    const sortBy = sortOrder ? sortOrder : defaultSortOrder;

    const getAPIOptions: Option[] = [];
    const csvDownloadOptions: CSVDownloadOption[] = [];

    const nftBlockchains = {
      ethereum: true,
      polygon: true,
      base: true,
      zora: true
    };

    const snapshotBlockchains = {
      ethereum: nftBlockchains.ethereum,
      base: nftBlockchains.base,
      zora: nftBlockchains.zora
    };

    // Token details page options ================================
    if (showTokenDetails && tokenInfo) {
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
      }
    }
    // Social details page options ===============================
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

      getAPIOptions.push({
        label: `${formattedDappName} followers`,
        link: socialFollowersDetailsLink
      });

      const dappName = socialInfo.dappName as 'farcaster' | 'lens';

      csvDownloadOptions.push({
        label: `${formattedDappName} followers`,
        key:
          dappName === 'farcaster'
            ? CsvQueryType.FarcasterFollowers
            : CsvQueryType.LensFollowers,
        fileName: `${dappName} followers of [${address[0]}]`,
        variables: {
          identity: address[0]
        }
      });

      getAPIOptions.push({
        label: `${formattedDappName} following`,
        link: socialFollowingDetailsLink
      });

      csvDownloadOptions.push({
        label: `${formattedDappName} following`,
        key:
          dappName === 'farcaster'
            ? CsvQueryType.FarcasterFollowings
            : CsvQueryType.LensFollowings,
        fileName: `${formattedDappName} following of [${address[0]}]`,
        variables: {
          identity: address[0]
        }
      });

      if (!socialInfo.followerTab && socialInfo.followingData?.mention) {
        const { followingData } = socialInfo;

        const nameFromMarkup = followingData.mentionRawText
          ? getUsableValues(followingData.mentionRawText)?.displayValue?.trim()
          : null;
        const name =
          nameFromMarkup ??
          `${followingData?.mention?.token?.toLowerCase().replace('_', ' ')} (${
            followingData?.mention?.address
          })`;

        const label = `${formattedDappName} following of [${address[0]}] x ${name} holders`;
        const tokenType = followingData.mention?.token;

        let key: null | CsvQueryType = null;

        if (dappName === 'farcaster') {
          key =
            tokenType === MentionType.TOKEN
              ? CsvQueryType.FarcasterErc20Followings
              : tokenType === MentionType.POAP
              ? CsvQueryType.FarcasterPoapFollowings
              : CsvQueryType.FarcasterNftFollowings;
        } else {
          key =
            tokenType === MentionType.TOKEN
              ? CsvQueryType.LensErc20Followings
              : tokenType === MentionType.POAP
              ? CsvQueryType.LensPoapFollowings
              : CsvQueryType.LensNftFollowings;
        }
        if (key) {
          csvDownloadOptions.push({
            label,
            key,
            fileName: `${label}`,
            variables: {
              identity: address[0],
              ...(tokenType === MentionType.POAP
                ? {
                    eventId: followingData.mention?.eventId
                  }
                : { tokenAddress: followingData.mention?.address })
            }
          });
        }
      }

      if (socialInfo.followerTab && socialInfo.followerData?.mention) {
        const { followerData } = socialInfo;

        const nameFromMarkup = followerData.mentionRawText
          ? getUsableValues(followerData.mentionRawText)?.displayValue?.trim()
          : null;
        const name =
          nameFromMarkup ??
          `${followerData?.mention?.token?.toLowerCase().replace('_', ' ')} (${
            followerData?.mention?.address
          })`;

        const label = `${formattedDappName} followers of [${address[0]}] x ${name} holders`;
        const tokenType = followerData.mention?.token;

        let key: null | CsvQueryType = null;

        if (dappName === 'farcaster') {
          key =
            tokenType === MentionType.TOKEN
              ? CsvQueryType.FarcasterErc20Followers
              : tokenType === MentionType.POAP
              ? CsvQueryType.FarcasterPoapFollowers
              : CsvQueryType.FarcasterNftFollowers;
        } else {
          key =
            tokenType === MentionType.TOKEN
              ? CsvQueryType.LensErc20Followers
              : tokenType === MentionType.POAP
              ? CsvQueryType.LensPoapFollowers
              : CsvQueryType.LensNftFollowers;
        }
        if (key) {
          csvDownloadOptions.push({
            label,
            key,
            fileName: `${label}`,
            variables: {
              identity: address[0],
              ...(tokenType === MentionType.POAP
                ? {
                    eventId: followerData.mention?.eventId
                  }
                : { tokenAddress: followerData.mention?.address })
            }
          });
        }
      }

      getAPIOptions.push({
        label: `${formattedDappName} profile details`,
        link: socialDetailsLink
      });
    }
    // Ens details page options ==================================
    else if (ensInfo.isApplicable) {
      const ensDetailsLink = createAppUrlWithQuery(domainDetailsQuery, {
        name: ensInfo.identity
      });

      getAPIOptions.push({
        label: `ENS details`,
        link: ensDetailsLink
      });
    }
    // Tokens page options =======================================
    else {
      if (!snapshotInfo.isApplicable && (!tokenType || tokenType === 'POAP')) {
        const poapsQuery = poapsOfCommonOwnersQuery({ owners });
        const poapLink = createAppUrlWithQuery(poapsQuery, {
          limit: 10,
          sortBy
        });

        getAPIOptions.push({
          label: 'POAPs',
          link: poapLink
        });

        csvDownloadOptions.push({
          label: 'POAPs',
          key: CsvQueryType.PoapBalances,
          fileName: `Poaps balances of [${address[0]}]`,
          variables: {
            identity: address[0],
            orderBy: 'DESC'
          }
        });
      }

      let tokenFilters = ['ERC721', 'ERC1155'];

      if (tokenType) {
        if (tokenType === 'ERC6551') {
          tokenFilters = ['ERC721'];
        } else {
          tokenFilters = [tokenType];
        }
      }

      let nftLink = '';
      let erc20Link = '';

      let nftCSVDownloadOption: null | CSVDownloadOption = null;
      let erc20CSVDownloadOption: null | CSVDownloadOption = null;

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

        const { name, value } = getCSVDownloadSnapshotVariables(snapshotInfo);
        let postFix = 'as of block ' + value;

        if (name === 'date' || name === 'timestamp') {
          postFix = 'as of ' + formatDate(value as string);
        }

        nftCSVDownloadOption = {
          label: 'NFTs',
          key: CsvQueryType.NftBalancesSnapshot,
          fileName: `NFT balances of [${address[0]}] ${postFix}`,
          variables: {
            identity: address[0],
            tokenType: ['ERC721', 'ERC1155'],
            [name]: value
          },
          filters: {
            ...nftBlockchains,
            filterSpam: false,
            snapshotFilter: name
          }
        };

        erc20Link = createAppUrlWithQuery(tokensQuery, {
          limit: 50,
          tokenType: ['ERC20'],
          ...queryFilters
        });

        erc20CSVDownloadOption = {
          label: 'ERC20s',
          key: CsvQueryType.Erc20BalancesSnapshot,
          fileName: `ERC20 balances of [${address[0]}] ${postFix}`,
          variables: {
            identity: address[0],
            [name]: value
          },
          filters: {
            ...snapshotBlockchains,
            filterSpam: false,
            snapshotFilter: name
          }
        };
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

        nftCSVDownloadOption = {
          label: 'NFTs',
          key: CsvQueryType.NftBalances,
          fileName: `NFT balances of [${address[0]}]`,
          variables: {
            identity: address[0],
            tokenType: ['ERC721', 'ERC1155']
          },
          filters: {
            ...nftBlockchains,
            filterSpam: false
          }
        };

        erc20Link = createAppUrlWithQuery(tokensQuery, {
          limit: 50,
          sortBy: sortBy,
          tokenType: ['ERC20']
        });

        erc20CSVDownloadOption = {
          label: 'ERC20s',
          key: CsvQueryType.Erc20Balances,
          fileName: `ERC20 balances of [${address[0]}]`,
          variables: {
            identity: address[0]
          },
          filters: {
            ...nftBlockchains,
            filterSpam: false
          }
        };
      }

      if (tokenType !== 'POAP') {
        getAPIOptions.push({
          label: 'Token Balances (NFT)',
          link: nftLink
        });

        csvDownloadOptions.push(nftCSVDownloadOption);
      }

      // !Gnosis: Don't show ERC20 option when gnosis blockchain is selected
      if (blockchain !== 'gnosis') {
        getAPIOptions.push({
          label: 'Token Balances (ERC20)',
          link: erc20Link
        });

        csvDownloadOptions.push(erc20CSVDownloadOption);
      }

      csvDownloadOptions.push({
        label: 'Socials, Domains & XMTP',
        key: CsvQueryType.Socials,
        fileName: `Socials, domains, XMTP of [${address[0]}]`,
        variables: {
          identity: address[0],
          tokenType: ['ERC721', 'ERC1155'],
          blockchain: 'ethereum',
          orderBy: 'DESC'
        }
      });

      if (address.length === 1) {
        const socialLink = createAppUrlWithQuery(SocialQuery, {
          identity: address[0]
        });

        getAPIOptions.push({
          label: 'Socials, Domains & XMTP',
          link: socialLink
        });
      }

      if (address.length === 2) {
        const socialLink = createAppUrlWithQuery(SocialOverlapQuery, {
          identity1: address[0],
          identity2: address[1]
        });

        getAPIOptions.push({
          label: 'Socials, Domains & XMTP',
          link: socialLink
        });
      }

      getAPIOptions.push({
        label: 'Spam Filters Guide',
        link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp/spam-filters'
      });
    }

    return [getAPIOptions, csvDownloadOptions] as const;
  }, [
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
    ensInfo.isApplicable,
    ensInfo.identity,
    snapshotInfo
  ]);
}
