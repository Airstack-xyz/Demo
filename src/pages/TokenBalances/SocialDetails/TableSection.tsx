import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UpdateUserInputs } from '../../../hooks/useSearchInput';
import {
  SocialInfo,
  getActiveSocialInfoString
} from '../../../utils/activeSocialInfoString';
import { Filters } from './Filters';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TableRow, TableRowLoader } from './TableRow';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { socialFollowersDetailsQuery } from '../../../queries/commonSocialFollowersQuery';
import { Follow, SocialFollowResponse } from './types';
import { AddressesModal } from '../../../Components/AddressesModal';
import { useNavigate } from 'react-router-dom';
import { createTokenBalancesUrl } from '../../../utils/createTokenUrl';
import { socialFollowingDetailsQuery } from '../../../queries/commonSocialFollowingQuery';

const LOADING_ROW_COUNT = 6;

function TableLoader() {
  const loaderItems = Array(LOADING_ROW_COUNT).fill(0);
  return (
    <div className="w-auto sm:w-full">
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
  isFollowerQuery?: boolean;
  setQueryData: UpdateUserInputs;
};

const LIMIT = 20;

export function TableSection({
  identities,
  socialInfo,
  isFollowerQuery,
  setQueryData
}: TableSectionProps) {
  const navigate = useNavigate();

  const [tableItems, setTableItems] = useState<Follow[]>([]);

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    dataType: '',
    addresses: []
  });
  //   const [loaderData, setLoaderData] = useState({
  //     isVisible: false,
  //     total: LIMIT,
  //     matching: 0
  //   });

  const query = useMemo(() => {
    if (isFollowerQuery) return socialFollowersDetailsQuery;
    return socialFollowingDetailsQuery;
  }, [isFollowerQuery]);

  const handleData = useCallback(
    (data: SocialFollowResponse) => {
      const items = isFollowerQuery
        ? data?.SocialFollowers?.Follower
        : data?.SocialFollowings?.Following;
      setTableItems(prev => [...prev, ...items]);
    },
    [isFollowerQuery]
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
      limit: LIMIT
    });
  }, [fetchData, identities, socialInfo.dappName]);

  const handleFiltersApply = useCallback(
    (filters: string[]) => {
      setQueryData(
        {
          activeSocialInfo: getActiveSocialInfoString({
            ...socialInfo,
            filters: filters
          })
        },
        { updateQueryParams: true }
      );
    },
    [setQueryData, socialInfo]
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
      <div className="flex items-center justify-end my-3">
        <Filters
          dappName={socialInfo.dappName}
          selectedFilters={socialInfo.filters}
          onApply={handleFiltersApply}
        />
      </div>
      <div className="w-full border-solid-light rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto mb-5">
        <InfiniteScroll
          next={handleNext}
          dataLength={tableItems.length}
          hasMore={hasNextPage}
          loader={null}
        >
          <table className="w-auto text-xs table-fixed sm:w-full">
            <thead className="bg-glass rounded-2xl">
              <tr className="[&>th]:text-xs [&>th]:font-bold [&>th]:text-left [&>th]:py-5 [&>th]:px-2 [&>th]:whitespace-nowrap">
                <th className="!pl-9">Token</th>
                <th>{isLensDapp ? 'Lens' : 'Farcaster'}</th>
                <th>Token ID</th>
                <th>Primary ENS</th>
                <th>ENS</th>
                <th>Wallet address</th>
                <th>{isLensDapp ? 'Farcaster' : 'Lens'}</th>
                <th className="!pr-9">XMTP </th>
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
                />
              ))}
            </tbody>
          </table>
          {!loading && tableItems.length === 0 && (
            <div className="flex flex-1 justify-center text-xs font-semibold mt-5">
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
