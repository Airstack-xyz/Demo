import { memo, useCallback, useEffect, useState } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Token } from './Token';
import { AddressesModal } from '../../../Components/AddressesModal';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { useGetCommonOwnersOfTokens } from '../../../hooks/useGetCommonOwnersOfTokens';
import { useGetCommonOwnersOfPoaps } from '../../../hooks/useGetCommonOwnersOfPoaps';

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
              <Token token={null} />
            </div>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TokensComponent() {
  const [{ address: tokenAddress, inputType }] = useSearchInput();
  const {
    fetch: fetchTokens,
    loading: loadingTokens,
    tokens: tokensData,
    ...paginationTokens
  } = useGetCommonOwnersOfTokens(tokenAddress);

  const {
    fetch: fetchPoap,
    loading: loadingPoaps,
    poaps,
    ...paginationPoaps
  } = useGetCommonOwnersOfPoaps(tokenAddress);

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
    if (tokenAddress.length === 0) return;

    if (isPoap) {
      fetchPoap();
      return;
    }

    fetchTokens();
  }, [fetchPoap, fetchTokens, isPoap, tokenAddress]);

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

  const loading = loadingPoaps || loadingTokens;

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  const tokens = isPoap ? poaps : tokensData;

  if (loading && (!tokens || tokens.length === 0)) {
    return (
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <Loader />
      </div>
    );
  }

  const isERC20 = tokens && tokens[0]?.tokenType === 'ERC20';

  return (
    <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
      <InfiniteScroll
        next={handleNext}
        dataLength={tokens.length}
        hasMore={hasNextPage}
        loader={null}
      >
        <table className="w-auto text-xs table-fixed sm:w-full">
          <Header isERC20={isERC20} />
          <tbody>
            {tokens.map((token, index) => (
              <tr
                key={index}
                className="[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px]"
                data-loader-type="block"
                data-loader-margin="10"
              >
                <Token token={token} onShowMore={handleShowMore} />
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <Loader />}
      </InfiniteScroll>
      <AddressesModal
        heading={`All ${modalValues.dataType} names of ${tokenAddress}`}
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
    </div>
  );
}

export const Tokens = memo(TokensComponent);
