import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { POAPQuery } from '../../queries';
import { PoapType, TokenType as TokenType } from './types';
import { useSearchInput } from '../../hooks/useSearchInput';
import { formatDate } from '../../utils';
import { tokenTypes } from './constants';
import { Icon } from '../../Components/Icon';
import { Link } from 'react-router-dom';
import { createTokenHolderUrl } from '../../utils/createTokenUrl';
import { Asset } from '../../Components/Asset';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTokensQuery } from '../../queries/tokensQuery';
import { defaultSortOrder } from './SortBy';

type TokenProps = {
  type: string;
  name: string;
  id: string;
  address: string;
  symbol: string;
  blockchain: 'ethereum' | 'polygon';
  tokenId: string;
  image?: string;
  eventId?: string;
  tokenName: string;
};

function Token({
  type,
  name,
  symbol,
  address,
  id,
  blockchain = 'ethereum',
  tokenId,
  image,
  eventId,
  tokenName
}: TokenProps) {
  const isPoap = type.toLowerCase() === 'poap';
  return (
    <Link
      className="h-[300px] w-[300px] rounded-18 bg-secondary p-2.5 flex flex-col justify-between overflow-hidden relative bg-glass token"
      data-loader-type="block"
      to={createTokenHolderUrl({
        address: isPoap && eventId ? eventId : address,
        inputType: type === 'POAP' ? 'POAP' : 'ADDRESS',
        type,
        blockchain,
        label: tokenName
      })}
      style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.30)' }}
    >
      <div className="absolute inset-0 [&>div]:w-full [&>div]:h-full [&>div>img]:w-full [&>div>img]:min-w-full flex-col-center">
        {(image || (address && tokenId)) && (
          <Asset
            image={image}
            address={address}
            tokenId={tokenId}
            chain={blockchain}
            preset="medium"
          />
        )}
      </div>
      <div className="flex justify-end">
        <div className="rounded-full h-9 w-9 bg-glass border-solid-light">
          <Icon name={blockchain} className="w-full" />
        </div>
        <div className="h-9 rounded-3xl ml-2.5 border-solid-light flex justify-center items-center px-2 bg-glass">
          {type}
        </div>
      </div>
      <div className="h-14 rounded-3xl flex flex-col px-3.5 py-2 text-sm bg-glass border-solid-light">
        <div className="ellipsis text-xs mb-">{name}</div>
        <div className="flex items-center justify-between font-bold ">
          <div className="ellipsis flex-1 mr-2">{id}</div>
          <div>{symbol || ''}</div>
        </div>
      </div>
    </Link>
  );
}

const loaderData = Array(6).fill({ token: {}, tokenNfts: {} });

function Loader() {
  return (
    <>
      {loaderData.map((_, index) => (
        <div className="skeleton-loader" key={index}>
          <Token
            key={index}
            type={''}
            name={''}
            id={''}
            address={''}
            symbol={''}
            blockchain={'ethereum'}
            tokenId={''}
            tokenName=""
          />
        </div>
      ))}
    </>
  );
}

type Poap = PoapType['Poaps']['Poap'][0];
const variables = {};
const config = {
  cache: false
};

function TokensComponent() {
  const [
    { address: owner, tokenType: tokenType = '', blockchainType, sortOrder }
  ] = useSearchInput();

  const fetchAllBlockchains =
    blockchainType.length === 2 || blockchainType.length === 0;

  const query = useMemo(() => {
    return getTokensQuery(fetchAllBlockchains ? null : blockchainType[0]);
  }, [blockchainType, fetchAllBlockchains]);

  const [
    fetchTokens,
    { data: tokensData, loading: loadingTokens, pagination: paginationTokens }
  ] = useLazyQueryWithPagination(query, variables, config);
  const [
    fetchPoaps,
    { data: poapsData, loading: loadingPoaps, pagination: paginationPoaps }
  ] = useLazyQueryWithPagination(POAPQuery, variables, config);

  const [tokens, setTokens] = useState<(TokenType | Poap)[]>([]);
  const isPoap = tokenType === 'POAP';

  const canFetchPoap = useMemo(() => {
    const hasPolygonChainFilter = blockchainType.includes('polygon');
    return !hasPolygonChainFilter && (!tokenType || isPoap);
  }, [blockchainType, isPoap, tokenType]);

  useEffect(() => {
    if (owner) {
      const hasPolygonChainFilter = blockchainType.includes('polygon');

      if (!tokenType || !isPoap) {
        fetchTokens({
          owner,
          limit: fetchAllBlockchains || !hasPolygonChainFilter ? 10 : 20,
          sortBy: sortOrder ? sortOrder : defaultSortOrder,
          tokenType:
            tokenType && tokenType.length > 0
              ? [tokenType]
              : tokenTypes.filter(tokenType => tokenType !== 'POAP')
        });
      }

      if (canFetchPoap) {
        fetchPoaps({
          owner,
          limit: isPoap ? 20 : 10,
          sortBy: sortOrder ? sortOrder : defaultSortOrder
        });
      }
      setTokens([]);
    }
  }, [
    blockchainType,
    canFetchPoap,
    fetchAllBlockchains,
    fetchPoaps,
    fetchTokens,
    isPoap,
    owner,
    sortOrder,
    tokenType
  ]);

  useEffect(() => {
    if (tokensData) {
      const { ethereum, polygon } = tokensData;
      const ethTokens = ethereum?.TokenBalance || [];
      const maticTokens = polygon?.TokenBalance || [];
      setTokens(tokens => [...tokens, ...ethTokens, ...maticTokens]);
    }
  }, [tokensData]);

  useEffect(() => {
    if (poapsData) {
      setTokens(tokens => [...tokens, ...(poapsData?.Poaps?.Poap || [])]);
    }
  }, [poapsData]);

  const handleNext = useCallback(() => {
    if (!loadingTokens && !isPoap && paginationTokens?.hasNextPage) {
      paginationTokens.getNextPage();
    }

    if (canFetchPoap && !loadingPoaps && paginationPoaps?.hasNextPage) {
      paginationPoaps.getNextPage();
    }
  }, [
    canFetchPoap,
    isPoap,
    loadingPoaps,
    loadingTokens,
    paginationPoaps,
    paginationTokens
  ]);

  const loading = loadingTokens || loadingPoaps;

  if (tokens.length === 0 && !loading) {
    return (
      <div className="flex flex-1 justify-center mt-10">No data found!</div>
    );
  }

  const hasNextPage =
    paginationTokens?.hasNextPage || paginationPoaps?.hasNextPage;
  if (tokens.length === 0 && loading) {
    return (
      <div className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start">
        <Loader />
      </div>
    );
  }

  return (
    <InfiniteScroll
      next={handleNext}
      dataLength={tokens.length}
      hasMore={hasNextPage}
      loader={loading ? <Loader /> : null}
      className="flex flex-wrap gap-x-[55px] gap-y-[55px] justify-center md:justify-start mb-10"
    >
      {tokens.map((_token, index) => {
        const token = _token as TokenType;
        const poap = _token as Poap;
        const isPoap = Boolean(poap.poapEvent);
        const poapEvent = poap.poapEvent || {};
        const city = poapEvent.city || '';

        const address = token.tokenAddress || poap.tokenAddress;
        const id = token.tokenNfts?.tokenId
          ? '#' + token.tokenNfts?.tokenId
          : poapEvent.eventName;

        const symbol = token?.token?.symbol || '';
        const type = token.tokenType || 'POAP';
        const blockchain = token.blockchain || 'ethereum';
        const name =
          token?.token?.name ||
          `${formatDate(poapEvent.startDate)}${city ? ` (${city})` : ''}`;
        const tokenId = token.tokenNfts?.tokenId || poap.tokenId;
        const image = isPoap ? poapEvent?.logo?.image?.medium : '';
        const eventId = poapEvent?.eventId || '';

        return (
          <div>
            <Token
              key={index}
              type={type}
              name={name}
              id={id}
              address={address}
              symbol={symbol}
              blockchain={blockchain}
              tokenId={tokenId}
              image={image}
              eventId={eventId}
              tokenName={isPoap ? poapEvent.eventName : token?.token?.name}
            />
          </div>
        );
      })}
    </InfiniteScroll>
  );
}

export const Tokens = memo(TokensComponent);
