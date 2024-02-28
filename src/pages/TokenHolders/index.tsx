import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { CSVDownloadDropdown } from '../../Components/CSVDownload/CSVDownloadDropdown';
import { AdvancedSettings } from '../../Components/Filters/AdvancedSettings';
import { SnapshotFilter } from '../../Components/Filters/SnapshotFilter';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { Icon } from '../../Components/Icon';
import { getAllWordsAndMentions } from '../../Components/Input/utils';
import { Search } from '../../Components/Search';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { ShareURLDropdown } from '../../Components/ShareURLDropdown';
import { useSearchInput } from '../../hooks/useSearchInput';
import { useCsvDownloadOptions } from '../../store/csvDownload';
import { useTokenDetails } from '../../store/tokenDetails';
import {
  TokenHolder,
  useOverviewTokens
} from '../../store/tokenHoldersOverview';
import {
  checkBlockchainSupportForSnapshot,
  getActiveSnapshotInfo
} from '../../utils/activeSnapshotInfoString';
import { getActiveTokenInfo } from '../../utils/activeTokenInfoString';
import { sortByAddressByNonERC20First } from '../../utils/getNFTQueryForTokensHolder';
import { showToast } from '../../utils/showToast';
import { HoldersOverview } from './Overview/Overview';
import { OverviewDetails } from './OverviewDetails/OverviewDetails';
import { Tokens } from './Tokens/Tokens';
import { ERC20_ADDRESS_WHITELIST } from './constants';
import { useDropdownOptions } from './hooks/useDropdownOptions';
import { TokenHoldersFrameModal } from '../../Components/FrameModal/TokenHolders';

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

  const tokenInfo = useMemo(() => {
    const { tokenAddress, tokenId, blockchain, eventId } =
      getActiveTokenInfo(activeTokenInfo);
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  }, [activeTokenInfo]);

  const [getAPIOptions, csvDownloadOptions] = useDropdownOptions({
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
  });

  const [, setCsvDownloadOptions] = useCsvDownloadOptions(['options']);

  useEffect(() => {
    setCsvDownloadOptions({ options: csvDownloadOptions });
  }, [csvDownloadOptions, setCsvDownloadOptions]);

  const { hasMultipleERC20, hasEveryERC20, hasSomeNft } = useMemo(() => {
    const erc20Tokens = overviewTokens?.filter(v => v.tokenType === 'ERC20');
    const erc20Mentions = mentions?.filter(
      v => v?.token === 'ERC20' || v?.token === 'TOKEN'
    );
    const hasEveryERC20 =
      mentions.every(
        v =>
          (v?.token === 'ERC20' || v?.token === 'TOKEN') &&
          !ERC20_ADDRESS_WHITELIST.includes(v.address)
      ) ||
      overviewTokens.every(
        v =>
          v.tokenType === 'ERC20' &&
          !ERC20_ADDRESS_WHITELIST.includes(v.tokenAddress)
      );
    const hasSomeNft =
      mentions?.some(v => v?.token === 'ERC721' || v?.token === 'ERC1155') ||
      overviewTokens?.some(
        v => v?.tokenType === 'ERC721' || v?.tokenType === 'ERC1155'
      );
    return {
      hasMultipleERC20: erc20Mentions?.length > 1 || erc20Tokens?.length > 1,
      hasEveryERC20,
      hasSomeNft
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
          <GetAPIDropdown options={getAPIOptions} dropdownAlignment="center" />
          <ShareURLDropdown dropdownAlignment="center" />
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
          <AdvancedSettings disabled={!hasSomeNft} />
        </div>
        <div className="flex items-center gap-3.5">
          <GetAPIDropdown options={getAPIOptions} dropdownAlignment="right" />
          <ShareURLDropdown dropdownAlignment="right" />
          {!isResolve6551Enabled && (
            <CSVDownloadDropdown options={csvDownloadOptions} />
          )}
          <TokenHoldersFrameModal disabled={isCombination} />
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
          <div className="my-3 flex-row-center">{renderFilterContent()}</div>
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
