import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Token } from './Token';
import { AddressesModal } from '../../../Components/AddressesModal';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { useGetCommonOwnersOfTokens } from '../../../hooks/useGetCommonOwnersOfTokens';
import { useGetCommonOwnersOfPoaps } from '../../../hooks/useGetCommonOwnersOfPoaps';
import { StatusLoader } from '../OverviewDetails/Tokens/StatusLoader';
import {
  TokenHolders,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';

const loaderData = Array(6).fill({});

function Loader() {
  return (
    <table className="w-auto text-xs table-fixed sm:w-full">
      <tbody>
        {loaderData.map((_, index) => (
          <tr
            key={index}
            className="[&>div>td]:px-2 [&>div>td]:py-3 [&>div>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer skeleton-loader [&>div>td:last-child]:hidden"
          >
            <div data-loader-type="block" data-loader-margin="10">
              <Token token={null} isCombination={false} />
            </div>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TokensComponent() {
  const [{ tokens: overviewTokens }] = useOverviewTokens(['tokens']);
  const [{ address, inputType }] = useSearchInput();

  const shouldFetchPoaps = useMemo(
    () => !address.some(address => address.startsWith('0x')),
    [address]
  );

  const hasMulitpleERC20 = useMemo(() => {
    const erc20Tokens = overviewTokens.filter(
      (token: TokenHolders) => token.tokenType === 'ERC20'
    );
    return erc20Tokens.length > 1;
  }, [overviewTokens]);

  const tokenAddress = useMemo(() => {
    const hasEitherAddressOrEvent =
      shouldFetchPoaps || address.every(address => address.startsWith('0x'));

    if (hasEitherAddressOrEvent) {
      // sort tokens by holders count so that the token with the least holders is the first one
      const sortedAddress = (overviewTokens as TokenHolders[]).sort(
        (a, b) => a.holdersCount - b.holdersCount
      );

      const ercTokens: TokenHolders[] = [],
        otherTokens: TokenHolders[] = [];

      sortedAddress.forEach(token => {
        if (token.tokenType === 'ERC20') {
          ercTokens.push(token);
        } else {
          otherTokens.push(token);
        }
      });
      // ERC20 tokens mostly have a large number of holders so keep it at the end of array so they are always in the inner query
      return [...otherTokens, ...ercTokens].map(_token =>
        _token.tokenAddress.toLowerCase()
      );
    }
    return address;
  }, [shouldFetchPoaps, address, overviewTokens]);

  const {
    fetch: fetchTokens,
    loading: loadingTokens,
    tokens: tokensData,
    processedTokensCount,
    ...paginationTokens
  } = useGetCommonOwnersOfTokens(tokenAddress);

  const {
    fetch: fetchPoap,
    loading: loadingPoaps,
    poaps,
    processedPoapsCount,
    ...paginationPoaps
  } = useGetCommonOwnersOfPoaps(address);

  const navigator = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalValues, setModalValues] = useState<{
    leftValues: string[];
    rightValues: string[];
    dataType: string;
  }>({
    leftValues: [],
    rightValues: [],
    dataType: ''
  });

  const isPoap = inputType === 'POAP';

  useEffect(() => {
    if (tokenAddress.length === 0 || hasMulitpleERC20) return;

    if (isPoap && shouldFetchPoaps) {
      fetchPoap();
      return;
    }

    fetchTokens();
  }, [
    fetchPoap,
    fetchTokens,
    isPoap,
    shouldFetchPoaps,
    address,
    tokenAddress.length,
    hasMulitpleERC20
  ]);

  const handleShowMore = useCallback((values: string[], dataType: string) => {
    const leftValues: string[] = [];
    const rightValues: string[] = [];
    values.forEach((value, index) => {
      if (index % 2 === 0) {
        leftValues.push(value);
      } else {
        rightValues.push(value);
      }
    });
    setModalValues({
      leftValues,
      rightValues,
      dataType: dataType || 'ens'
    });
    setShowModal(true);
  }, []);

  const handleAddressClick = useCallback(
    (address: string) => {
      const isFarcaster = modalValues.dataType?.includes('farcaster');
      navigator(
        createTokenBalancesUrl({
          address: isFarcaster ? `fc_fname:${address}` : address,
          blockchain: 'ethereum',
          inputType: 'ADDRESS'
        })
      );
    },
    [modalValues.dataType, navigator]
  );

  const { hasNextPage, getNextPage } = isPoap
    ? paginationPoaps
    : paginationTokens;

  const loading = overviewTokens.length === 0 || loadingPoaps || loadingTokens;

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  const tokens = shouldFetchPoaps ? poaps : tokensData;
  const totalProcessed = processedTokensCount + processedPoapsCount;
  const isCombination = address.length > 1;
  const showStatusLoader = loading && isCombination;

  // ERC20 tokens have a large number of holders so we don't allow multiple ERC20 tokens to be searched at once
  if (hasMulitpleERC20) return null;

  if (loading && (!tokens || tokens.length === 0)) {
    return (
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <Loader />
        {showStatusLoader && (
          <StatusLoader total={totalProcessed} matching={tokens.length} />
        )}
      </div>
    );
  }

  const isERC20 = tokens && tokens[0]?.tokenType === 'ERC20';

  return (
    <>
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto mb-5">
        <InfiniteScroll
          next={handleNext}
          dataLength={tokens.length}
          hasMore={hasNextPage}
          loader={null}
        >
          <table className="w-auto text-xs table-fixed sm:w-full">
            <Header isERC20={isERC20} isCombination={isCombination} />
            <tbody>
              {tokens.map((token, index) => (
                <tr
                  key={index}
                  className="[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px]"
                  data-loader-type="block"
                  data-loader-margin="10"
                >
                  <Token
                    token={token}
                    isCombination={isCombination}
                    onShowMore={handleShowMore}
                  />
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && tokens.length === 0 && (
            <div className="flex flex-1 justify-center text-xs font-semibold mt-5">
              No data found!
            </div>
          )}
        </InfiniteScroll>
        {loading && <Loader />}
      </div>
      <AddressesModal
        heading={`All ${modalValues.dataType} names of ${address}`}
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setModalValues({
            leftValues: [],
            rightValues: [],
            dataType: ''
          });
        }}
        modalValues={modalValues}
        onAddressClick={handleAddressClick}
      />
      {showStatusLoader && (
        <StatusLoader total={totalProcessed} matching={tokens.length} />
      )}
    </>
  );
}

export const Tokens = memo(TokensComponent);
