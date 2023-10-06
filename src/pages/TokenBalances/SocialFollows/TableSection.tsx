import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { LazyAddressesModal } from '../../../Components/LazyAddressesModal';
import { StatusLoader } from '../../../Components/StatusLoader';
import {
  UpdateUserInputs,
  resetCachedUserInputs
} from '../../../hooks/useSearchInput';
import { getSocialFollowersQuery } from '../../../queries/socialFollowersQuery';
import { getSocialFollowingsQuery } from '../../../queries/socialFollowingQuery';
import {
  SocialInfo,
  getActiveSocialInfoString
} from '../../../utils/activeSocialInfoString';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { isMobileDevice } from '../../../utils/isMobileDevice';
import { showToast } from '../../../utils/showToast';
import { Filters } from './Filters';
import { MentionInput, MentionOutput } from './MentionInput';
import { TableRow, TableRowLoader } from './TableRow';
import { Follow, SocialFollowResponse } from './types';
import { filterTableItems, getSocialFollowFilterData } from './utils';
import { getActiveTokenInfoString } from '../../../utils/activeTokenInfoString';
import './styles.css';

const LOADING_ROW_COUNT = 6;

const loaderItems = Array(LOADING_ROW_COUNT).fill(0);

function TableLoader() {
  return (
    <div className="w-auto sm:w-full py-3">
      {loaderItems.map((_, index) => (
        <TableRowLoader key={index} />
      ))}
    </div>
  );
}

type ModalData = {
  isOpen: boolean;
  dataType?: string;
  identity?: string;
  addresses: string[];
};

type TableSectionProps = {
  identities: string[];
  socialInfo: SocialInfo;
  isFollowerQuery: boolean;
  setQueryData: UpdateUserInputs;
};

const mentionValidationFn = ({ mentions }: MentionOutput) => {
  if (mentions.length > 1) {
    showToast('You can only enter one token at a time', 'negative');
    return false;
  }
  return true;
};

const MAX_LIMIT = 200;
const MIN_LIMIT = 20;

export function TableSection({
  identities,
  socialInfo,
  isFollowerQuery,
  setQueryData
}: TableSectionProps) {
  const navigate = useNavigate();

  const [tableItems, setTableItems] = useState<Follow[]>([]);
  const tableItemsRef = useRef<Follow[]>([]);
  const tableIdsSetRef = useRef<Set<string>>(new Set());

  const isMobile = isMobileDevice();

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    dataType: '',
    identity: '',
    addresses: []
  });
  const [loaderData, setLoaderData] = useState({
    isVisible: false,
    total: MAX_LIMIT,
    matching: 0
  });

  const followDataKey = isFollowerQuery ? 'followerData' : 'followingData';
  const followData = socialInfo[followDataKey];

  const filterData = useMemo(
    () =>
      getSocialFollowFilterData({
        ...followData,
        identities,
        dappName: socialInfo.dappName,
        profileTokenIds: socialInfo.profileTokenIds,
        isFollowerQuery
      }),
    [
      followData,
      identities,
      isFollowerQuery,
      socialInfo.dappName,
      socialInfo.profileTokenIds
    ]
  );

  const query = useMemo(() => {
    if (isFollowerQuery) return getSocialFollowersQuery(filterData);
    return getSocialFollowingsQuery(filterData);
  }, [isFollowerQuery, filterData]);

  const handleData = useCallback(
    (data: SocialFollowResponse) => {
      const items =
        (isFollowerQuery
          ? data?.SocialFollowers?.Follower
          : data?.SocialFollowings?.Following) || [];

      const filteredItems = filterTableItems({
        ...followData,
        items,
        dappName: socialInfo.dappName,
        isFollowerQuery
      }).filter(item => {
        const id = `${item.followerProfileId}-${item.followingProfileId}`;
        if (tableIdsSetRef.current.has(id)) {
          return false;
        }
        tableIdsSetRef.current.add(id);
        return true;
      });

      tableItemsRef.current = [...tableItemsRef.current, ...filteredItems];

      setTableItems(prev => [...prev, ...filteredItems]);
      setLoaderData(prev => ({
        ...prev,
        total: prev.total + items.length,
        matching: prev.matching + filteredItems.length
      }));
    },
    [followData, isFollowerQuery, socialInfo.dappName]
  );

  const [fetchData, { loading, pagination }] = useLazyQueryWithPagination(
    query,
    {},
    { onCompleted: handleData, cache: false }
  );

  const { hasNextPage, getNextPage } = pagination;

  useEffect(() => {
    if (loading) return;
    if (tableItemsRef.current.length < MIN_LIMIT && hasNextPage) {
      getNextPage();
    } else {
      tableItemsRef.current = [];
      setLoaderData(prev => ({
        ...prev,
        isVisible: false
      }));
    }
  }, [loading, hasNextPage, getNextPage]);

  useEffect(() => {
    tableItemsRef.current = [];
    tableIdsSetRef.current = new Set();
    setTableItems([]);
    fetchData({
      limit: MAX_LIMIT,
      ...filterData.queryFilters
    });
  }, [fetchData, identities, filterData.queryFilters, socialInfo.dappName]);

  const handleQueryUpdate = useCallback(
    (data: object) => {
      setQueryData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            ...socialInfo,
            followerTab: isFollowerQuery,
            [followDataKey]: {
              ...followData,
              ...data
            }
          })
        },
        { updateQueryParams: true }
      );
    },
    [followData, followDataKey, isFollowerQuery, setQueryData, socialInfo]
  );

  const handleFiltersApply = useCallback(
    (filters: string[]) => {
      handleQueryUpdate({ filters });
    },
    [handleQueryUpdate]
  );

  const handleMentionSubmit = useCallback(
    ({ rawText }: MentionOutput) => {
      handleQueryUpdate({ mentionRawText: rawText });
    },
    [handleQueryUpdate]
  );

  const handleMentionClear = useCallback(() => {
    handleQueryUpdate({ mentionRawText: '' });
  }, [handleQueryUpdate]);

  const handleAddressClick = useCallback(
    (address: string, type?: string) => {
      const isFarcaster = type === 'farcaster';
      const url = createTokenBalancesUrl({
        address: isFarcaster ? `fc_fname:${address}` : address,
        blockchain: 'ethereum',
        inputType: 'ADDRESS'
      });
      document.documentElement.scrollTo(0, 0);
      resetCachedUserInputs('tokenBalance');
      navigate(url);
    },
    [navigate]
  );

  const handleAssetClick = useCallback(
    (
      tokenAddress: string,
      tokenId: string,
      blockchain: string,
      eventId?: string
    ) => {
      document.documentElement.scrollTo(0, 0);
      setQueryData(
        {
          activeTokenInfo: getActiveTokenInfoString(
            tokenAddress,
            tokenId,
            blockchain,
            eventId
          )
        },
        { updateQueryParams: true }
      );
    },
    [setQueryData]
  );

  const handleShowMoreClick = (
    addresses: string[],
    dataType?: string,
    identity?: string
  ) => {
    setModalData({
      isOpen: true,
      dataType,
      addresses,
      identity
    });
  };

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      dataType: '',
      addresses: []
    });
  };

  const handleNext = useCallback(() => {
    if (!loading && hasNextPage && getNextPage) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  const isLensDapp = socialInfo.dappName === 'lens';
  const isInputDisabled = loading || loaderData.isVisible;

  const mentionInputComponent = (
    <MentionInput
      defaultValue={followData.mentionRawText}
      disabled={isInputDisabled}
      placeholder="Input a token to view overlap"
      className={isMobile ? 'h-[35px]' : undefined}
      validationFn={mentionValidationFn}
      onSubmit={handleMentionSubmit}
      onClear={handleMentionClear}
    />
  );

  return (
    <>
      <Filters
        dappName={socialInfo.dappName}
        selectedFilters={followData.filters}
        isFollowerQuery={isFollowerQuery}
        disabled={isInputDisabled}
        customLeftComponent={isMobile ? undefined : mentionInputComponent}
        onApply={handleFiltersApply}
      />
      {isMobile && <div className="mb-4 mx-1">{mentionInputComponent}</div>}
      <div className="border-solid-light rounded-2xl sm:overflow-hidden overflow-y-auto mb-5 mx-1">
        <InfiniteScroll
          next={handleNext}
          dataLength={tableItems.length}
          hasMore={hasNextPage}
          loader={null}
        >
          <table className="sf-table">
            <thead>
              <tr>
                <th
                  className={
                    followData.mentionRawText ? 'w-[200px]' : undefined
                  }
                >
                  {isLensDapp || followData.mentionRawText
                    ? 'Token image'
                    : 'Profile image'}
                </th>
                <th>{isLensDapp ? 'Lens' : 'Farcaster'}</th>
                {!isLensDapp && <th>FID</th>}
                <th>Primary ENS</th>
                <th>ENS</th>
                <th>Wallet address</th>
                <th>{isLensDapp ? 'Farcaster' : 'Lens'}</th>
                <th>XMTP </th>
              </tr>
            </thead>
            <tbody>
              {tableItems.map((item, index) => (
                <TableRow
                  key={index}
                  item={item}
                  isFollowerQuery={isFollowerQuery}
                  isLensDapp={isLensDapp}
                  onShowMoreClick={handleShowMoreClick}
                  onAddressClick={handleAddressClick}
                  onAssetClick={handleAssetClick}
                />
              ))}
            </tbody>
          </table>
          {!loading && tableItems.length === 0 && (
            <div className="flex flex-1 justify-center text-xs font-semibold my-5">
              No data found!
            </div>
          )}
          {loading && <TableLoader />}
        </InfiniteScroll>
      </div>
      {modalData.isOpen && (
        <LazyAddressesModal
          heading={`All ${modalData.dataType} names of ${
            modalData?.identity || modalData.addresses[0]
          }`}
          isOpen={modalData.isOpen}
          addresses={modalData.addresses}
          dataType={modalData.dataType}
          onRequestClose={handleModalClose}
          onAddressClick={handleAddressClick}
        />
      )}
      {(loading || loaderData.isVisible) && (
        <StatusLoader total={loaderData.total} matching={loaderData.matching} />
      )}
    </>
  );
}
