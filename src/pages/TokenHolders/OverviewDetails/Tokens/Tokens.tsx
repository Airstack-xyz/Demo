import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchInput } from '../../../../hooks/useSearchInput';
import { getDAppType } from '../../utils';
import { Modal } from '../../../../Components/Modal';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { Header } from './Header';
import { ListWithMoreOptions } from './ListWithMoreOptions';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poap, Token as TokenType } from '../../types';
import { Icon } from '../../../../Components/Icon';
import { filterTokens } from './filters';
import {
  getFilterablePoapsQuery,
  getFilterableTokensQuery
} from '../../../../queries/token-holders';

const LIMIT = 50;

export function Token({
  token,
  onShowMore
}: {
  token: TokenType | Poap | null;
  onShowMore?: (value: string[], dataType: string) => void;
}) {
  const owner = token?.owner;
  const walletAddress = owner?.addresses || '';
  const primarEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);

  const { lens, farcaster } = useMemo(() => {
    const social = owner?.socials || [];
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
  }, [owner?.socials]);

  const getShowMoreHandler = useCallback(
    (items: string[], type: string) => () => {
      onShowMore?.(items, type);
    },
    [onShowMore]
  );

  return (
    <>
      <td>
        <ListWithMoreOptions
          list={ens}
          onShowMore={getShowMoreHandler(ens, 'ens')}
        />
      </td>
      <td className="ellipsis">{primarEns || '--'}</td>
      <td className="ellipsis">{walletAddress || '--'}</td>
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
      <td>
        {xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
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
          className="[&>td]:px-2 [&>td]:py-4 [&>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer skeleton-loader [&>td:last-child]:hidden"
          data-loader-type="block"
          data-loader-margin="10"
        >
          <Token token={null} />
        </tr>
      ))}
    </>
  );
}

type RequestFilters = {
  socialFilters?: string[];
  hasPrimaryDomain?: boolean;
};

export function TokensComponent() {
  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const tokensRef = useRef<(TokenType | Poap)[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [{ tokenFilters: filters }] = useSearchInput();

  const requestFilters = useMemo(() => {
    const requestFilters: RequestFilters = {
      socialFilters: []
    };

    filters.forEach(filter => {
      if (filter === 'farcaster' || filter === 'lens') {
        requestFilters['socialFilters']?.push(filter);
      }
      if (filter === 'primaryEns') {
        requestFilters['hasPrimaryDomain'] = true;
      }
    });

    if (requestFilters['socialFilters']?.length === 0) {
      delete requestFilters['socialFilters'];
    }

    return requestFilters;
  }, [filters]);

  const { tokensQuery, poapsQuery } = useMemo(() => {
    const tokensQuery = getFilterableTokensQuery(
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
    const poapsQuery = getFilterablePoapsQuery(
      Boolean(requestFilters?.socialFilters),
      requestFilters?.hasPrimaryDomain
    );
    return {
      tokensQuery,
      poapsQuery
    };
  }, [requestFilters?.hasPrimaryDomain, requestFilters?.socialFilters]);

  const [
    fetchTokens,
    { data, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(tokensQuery);
  const [
    fetchPoap,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(poapsQuery);

  // save data to tokensData and user if further so, if we apply filter we can set this to null,
  // and fetch next data call will not be made
  let tokensData = data || null;

  const [{ address: tokenAddress, inputType }] = useSearchInput();

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
      // eslint-disable-next-line
      tokensData = null;
      tokensRef.current = [];
      setTokens([]);

      if (isPoap) {
        fetchPoap({
          eventId: tokenAddress,
          limit: LIMIT,
          ...requestFilters
        });
        return;
      }

      fetchTokens({
        tokenAddress,
        limit: LIMIT,
        ...requestFilters
      });
    }
  }, [fetchPoap, fetchTokens, filters, isPoap, requestFilters, tokenAddress]);

  const { hasNextPage, getNextPage } = isPoap
    ? paginationPoaps
    : paginationTokens;

  const loading = loadingPoaps || loadingTokens;

  useEffect(() => {
    if (!tokensData || isPoap || loading) return;

    const ethTokenBalances: TokenType[] =
      tokensData.ethereum?.TokenBalance || [];
    const polygonTokenBalances: TokenType[] =
      tokensData.polygon?.TokenBalance || [];

    const filteredTokens = filterTokens(filters, [
      ...ethTokenBalances,
      ...polygonTokenBalances
    ]);

    tokensRef.current = [...tokensRef.current, ...filteredTokens];

    if (tokensRef.current.length < LIMIT && hasNextPage) {
      getNextPage();
    } else {
      setTokens(existingTokens => [...existingTokens, ...tokensRef.current]);
      setLoadingData(false);
    }
  }, [filters, isPoap, tokensData, loading, hasNextPage, getNextPage]);

  useEffect(() => {
    if (!poapsData) return;

    const filteredPoaps = filterTokens(filters, poapsData?.Poaps?.Poap || []);

    setTokens(existingPoaps => [...existingPoaps, ...filteredPoaps]);
  }, [filters, poapsData]);

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

  const showLoader = loading || loadingData;

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
                className="[&>td]:px-2 [&>td]:py-4 [&>td]:align-middle min-h-[54px] hover:bg-glass cursor-pointer"
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
            {showLoader && <Loader />}
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

export const OverviewDetailsTokens = memo(TokensComponent);
