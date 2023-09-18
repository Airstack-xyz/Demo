import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { AddressesModal } from '../../../Components/AddressesModal';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import { getSocialFollowersQuery } from '../../../queries/socialFollowersQuery';
import { getSocialFollowingsQuery } from '../../../queries/socialFollowingQuery';
import {
  SocialInfo,
  getActiveSocialInfoString
} from '../../../utils/activeSocialInfoString';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { Filters } from './Filters';
import { TableRow, TableRowLoader } from './TableRow';
import { Follow, SocialFollowResponse } from './types';
import { filterTableItems, getSocialFollowFilterData } from './utils';

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
  addresses: string[];
};

type TableSectionProps = {
  identities: string[];
  socialInfo: SocialInfo;
  isFollowerQuery: boolean;
  setQueryData: UpdateUserInputs;
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

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    dataType: '',
    addresses: []
  });

  const _filtersKey = isFollowerQuery ? 'followerFilters' : 'followingFilters';
  const _filters = isFollowerQuery
    ? socialInfo.followerFilters
    : socialInfo.followingFilters;

  const filterData = useMemo(
    () =>
      getSocialFollowFilterData({
        filters: _filters,
        isFollowerQuery
      }),
    [_filters, isFollowerQuery]
  );

  const query = useMemo(() => {
    if (isFollowerQuery) return getSocialFollowersQuery(filterData);
    return getSocialFollowingsQuery(filterData);
  }, [isFollowerQuery, filterData]);

  const handleData = useCallback(
    (data: SocialFollowResponse) => {
      const items =
        data?.SocialFollowers?.Follower || // when follower query
        data?.SocialFollowings?.Following || // when following query
        [];

      const filteredItems = filterTableItems({
        items,
        filters: _filters
      });

      tableItemsRef.current = [...tableItemsRef.current, ...filteredItems];
      setTableItems(prev => [...prev, ...filteredItems]);
    },
    [_filters]
  );

  const [fetchData, { loading, pagination }] = useLazyQueryWithPagination(
    query,
    {},
    { onCompleted: handleData }
  );

  const { hasNextPage, getNextPage } = pagination;

  useEffect(() => {
    fetchData({
      identity: identities[0],
      dappName: socialInfo.dappName,
      limit: MAX_LIMIT,
      ...filterData.queryFilters
    });
  }, [fetchData, identities, filterData.queryFilters, socialInfo.dappName]);

  useEffect(() => {
    if (!tableItems || loading) return;
    if (tableItemsRef.current.length < MIN_LIMIT && hasNextPage) {
      getNextPage();
    } else {
      tableItemsRef.current = [];
    }
  }, [tableItems, loading, hasNextPage, getNextPage]);

  const handleFiltersApply = useCallback(
    (filters: string[]) => {
      setQueryData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            ...socialInfo,
            followerTab: isFollowerQuery,
            [_filtersKey]: filters
          })
        },
        { updateQueryParams: true }
      );
    },
    [_filtersKey, isFollowerQuery, setQueryData, socialInfo]
  );

  const handleAddressClick = useCallback(
    (address: string, type?: string) => {
      const isFarcaster = type === 'farcaster';
      const url = createTokenBalancesUrl({
        address: isFarcaster ? `fc_fname:${address}` : address,
        blockchain: 'ethereum',
        inputType: 'ADDRESS'
      });
      navigate(url);
    },
    [navigate]
  );

  const handleShowMoreClick = (values: string[], type?: string) => {
    setModalData({
      isOpen: true,
      dataType: type,
      addresses: values
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

  return (
    <>
      <Filters
        dappName={socialInfo.dappName}
        selectedFilters={_filters}
        isFollowerQuery={isFollowerQuery}
        disabled={loading}
        onApply={handleFiltersApply}
      />
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden overflow-y-auto mb-5">
        <InfiniteScroll
          next={handleNext}
          dataLength={tableItems.length}
          hasMore={hasNextPage}
          loader={null}
        >
          <table className="social-follow-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>{isLensDapp ? 'Lens' : 'Farcaster'}</th>
                <th>Token ID</th>
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
                  isLensDapp={isLensDapp}
                  onShowMoreClick={handleShowMoreClick}
                  onAddressClick={handleAddressClick}
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
      <AddressesModal
        heading={`All ${modalData.dataType} names of ${identities[0]}`}
        isOpen={modalData.isOpen}
        addresses={modalData.addresses}
        dataType={modalData.dataType}
        onRequestClose={handleModalClose}
        onAddressClick={handleAddressClick}
      />
    </>
  );
}
