import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { Modal } from './Modal';
import { DomainsQuery, SocialsQuery } from '../queries';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useCallback, useEffect, useState } from 'react';

const LOADING_ITEM_COUNT = 16;

const loaderItems = Array(LOADING_ITEM_COUNT).fill(0);

const Loader = () => {
  return (
    <>
      {loaderItems.map((_, index) => (
        <div
          key={index}
          className="skeleton-loader h-8"
          data-loader-type="block"
        />
      ))}
    </>
  );
};

type QueryResponse = {
  Domains: {
    Domain: {
      name: string;
    }[];
  };
  Socials: {
    Social: {
      profileName: string;
    }[];
  };
};

type LazyAddressesModalProps = {
  isOpen: boolean;
  heading: string;
  addresses: string[];
  dataType?: string;
  onAddressClick: (address: string, dataType?: string) => void;
  onRequestClose: () => void;
};

const LIMIT = 50;

export function LazyAddressesModal({
  isOpen,
  heading,
  addresses,
  dataType = 'ens',
  onAddressClick,
  onRequestClose
}: LazyAddressesModalProps) {
  const [items, setItems] = useState<string[]>([]);

  const isENS = dataType === 'ens';

  const handleData = useCallback(
    (data: QueryResponse) => {
      let newItems: string[] = [];
      if (isENS) {
        newItems = data?.Domains?.Domain?.map(v => v.name) || [];
      } else {
        newItems = data?.Socials?.Social?.map(v => v.profileName) || [];
      }
      setItems(prev => [...prev, ...newItems]);
    },
    [isENS]
  );

  const query = isENS ? DomainsQuery : SocialsQuery;

  const [
    fetchData,
    {
      loading,
      pagination: { hasNextPage, getNextPage }
    }
  ] = useLazyQueryWithPagination(
    query,
    {
      addresses,
      dappName: isENS ? undefined : dataType,
      limit: LIMIT
    },
    {
      onCompleted: handleData,
      cache: false
    }
  );

  useEffect(() => {
    setItems([]);
    fetchData({
      addresses,
      dappName: isENS ? undefined : dataType,
      limit: LIMIT
    });
  }, [addresses, dataType, fetchData, isENS]);

  const handleNext = useCallback(() => {
    if (hasNextPage && !loading) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  return (
    <Modal heading={heading} isOpen={isOpen} onRequestClose={onRequestClose}>
      <InfiniteScroll
        next={handleNext}
        dataLength={items.length}
        hasMore={hasNextPage}
        height={400}
        loader={null}
        className="w-[600px] h-auto bg-primary rounded-xl p-5 grid grid-cols-2 auto-rows-max gap-y-5 gap-x-2"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="px-3 py-1 h-8 rounded-18 ellipsis hover:bg-glass cursor-pointer"
            onClick={() => onAddressClick(item, dataType)}
          >
            {item}
          </div>
        ))}
        {loading && <Loader />}
      </InfiniteScroll>
    </Modal>
  );
}
