import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PoapOwnerQuery, TokenOwnerQuery } from '../../../queries';
import { useSearchInput, UserInputs } from '../../../hooks/useSearchInput';
import { getDAppType } from '../utils';
import { Chain } from '@airstack/airstack-react/constants';
import { Modal } from '../../../Components/Modal';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { Header } from './Header';
import { ListWithMoreOptions } from './ListWithMoreOptions';
import { useNavigate } from 'react-router-dom';
import { Asset } from '../../../Components/Asset';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poap, Token as TokenType } from './types';

const LIMIT = 20;

export function Token({
  token,
  onShowMore
}: {
  token: TokenType | Poap | null;
  onShowMore?: (value: string[], dataType: string) => void;
}) {
  const walletAddress = token?.owner?.addresses || '';
  const tokenId = token?.tokenId || '';
  const tokenAddress = token?.tokenAddress || '';
  const primarEns = token?.owner?.primaryDomain?.name || '';
  const ens = token?.owner?.domains?.map(domain => domain.name) || [];

  const { lens, farcaster } = useMemo(() => {
    const social = token?.owner?.socials || [];
    const result = { lens: [], farcaster: [] };
    social.forEach(({ dappSlug, profileName }) => {
      const type = getDAppType(dappSlug);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const list = result[type];
      if (list) {
        list.push(profileName);
      }
    });
    return result;
  }, [token]);

  const getShowMoreHandler = useCallback(
    (items: string[], type: string) => () => {
      onShowMore?.(items, type);
    },
    [onShowMore]
  );

  return (
    <>
      <td className="!pl-9">
        <div className="token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden [&>div]:w-full [&>div>img]:w-full">
          {tokenAddress && tokenId && (
            <Asset
              address={tokenAddress}
              tokenId={tokenId}
              preset="small"
              containerClassName="token-img"
              chain={token?.blockchain as Chain}
            />
          )}
        </div>
      </td>
      <td className="ellipsis">{walletAddress || '--'}</td>
      <td className="ellipsis">{tokenId ? `#${tokenId}` : '--'}</td>
      <td className="ellipsis">{primarEns || '--'}</td>
      <td>
        <ListWithMoreOptions
          list={ens}
          onShowMore={getShowMoreHandler(ens, 'ens')}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={lens}
          onShowMore={getShowMoreHandler(lens, 'lens')}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={farcaster}
          onShowMore={getShowMoreHandler(farcaster, 'farcaster')}
        />
      </td>
      {/* <td>@</td> */}
    </>
  );
}

const loaderData = Array(6).fill({});

function Loader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <tr
          key={index}
          className="[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer skeleton-loader"
          data-loader-type="block"
          data-loader-margin="10"
        >
          <Token token={null} />
        </tr>
      ))}
    </>
  );
}

export function TokensComponent() {
  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const [
    fetchTokens,
    { data: tokensData, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(TokenOwnerQuery);

  const [
    fetchPoap,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(PoapOwnerQuery);

  const { address: tokenAddress, inputType }: UserInputs = useSearchInput();

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

  const navigate = useNavigate();
  const isPoap = inputType === 'POAP';

  useEffect(() => {
    if (tokenAddress) {
      if (isPoap) {
        fetchPoap({
          eventId: tokenAddress,
          limit: LIMIT
        });
        return;
      }

      fetchTokens({
        tokenAddress,
        limit: LIMIT
      });
    }
  }, [fetchPoap, fetchTokens, isPoap, tokenAddress]);

  useEffect(() => {
    if (!tokensData || isPoap) return;

    const ethTokenBalances: TokenType[] =
      tokensData.ethereum?.TokenBalance || [];
    const polygonTokenBalances: TokenType[] =
      tokensData.polygon?.TokenBalance || [];

    setTokens(existingTokens => [
      ...existingTokens,
      ...ethTokenBalances,
      ...polygonTokenBalances
    ]);
  }, [isPoap, tokensData]);

  useEffect(() => {
    if (!poapsData) return;
    const poaps: Poap[] = poapsData.Poaps?.Poap || [];
    setTokens(existingPoaps => [...existingPoaps, ...poaps]);
  }, [poapsData]);

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
      dataType
    });
    setShowModal(true);
  }, []);

  const { hasNextPage, getNextPage } = isPoap
    ? paginationPoaps
    : paginationTokens;

  const loading = loadingPoaps || loadingTokens;

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  if (loading && (!tokens || tokens.length === 0)) {
    return (
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
        <table className="w-auto text-xs table-fixed sm:w-full">
          <tbody>
            <Loader />
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
      <InfiniteScroll
        next={handleNext}
        dataLength={tokens.length}
        hasMore={hasNextPage}
        loader={null}
      >
        <table className="w-auto text-xs table-fixed sm:w-full">
          {!loading && <Header />}
          <tbody>
            {tokens.map((token, index) => (
              <tr
                key={index}
                className="[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer"
                data-loader-type="block"
                data-loader-margin="10"
                onClick={() => {
                  const address = token?.owner?.addresses || '';
                  if (address) {
                    navigate(
                      `/token-balances?address=${address}&rawInput=${address}`
                    );
                  }
                }}
              >
                <Token token={token} onShowMore={handleShowMore} />
              </tr>
            ))}
            {loading && <Loader />}
          </tbody>
        </table>
      </InfiniteScroll>
      <Modal
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
      >
        <div className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto flex">
          <div className="flex-1">
            {modalValues.leftValues.map((value, index) => (
              <div className="mb-8" key={index}>
                {value}
              </div>
            ))}
          </div>
          <div className="border-l border-solid border-stroke-color flex-1 pl-5">
            {modalValues.rightValues.map((value, index) => (
              <div className="mb-8" key={index}>
                {value}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export const Tokens = memo(TokensComponent);
