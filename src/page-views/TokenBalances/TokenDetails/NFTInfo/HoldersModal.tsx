import { useCallback, useEffect, useRef } from 'react';
import { Modal } from '../../../../Components/Modal';
import { useGetTokenHolders } from '../../../../hooks/useGetTokenHolders';
import InfiniteScroll from 'react-infinite-scroll-component';

const LIMIT = 50;

export type HoldersModalProps = {
  isOpen: boolean;
  token: {
    tokenId: string;
    tokenAddress: string;
    blockchain: string;
  };
  heading: string;
  onAddressClick: (address: string) => void;
  onRequestClose: () => void;
};

export function LoaderItem() {
  return (
    <div
      className="skeleton-loader h-5"
      data-loader-type="block"
      data-loader-width="75"
    ></div>
  );
}

export function HoldersModal({
  heading,
  isOpen,
  token,
  onAddressClick,
  onRequestClose
}: HoldersModalProps) {
  const allHoldersRef = useRef<string[]>([]);

  const {
    fetchHolders,
    data: owners,
    loading,
    pagination: { hasNextPage, getNextPage }
  } = useGetTokenHolders(
    {
      ...token,
      limit: LIMIT
    },
    data => {
      allHoldersRef.current = [...allHoldersRef.current, ...data];
      return allHoldersRef.current;
    }
  );

  useEffect(() => {
    fetchHolders();
  }, [fetchHolders]);

  const handleNext = useCallback(() => {
    if (hasNextPage && !loading) {
      getNextPage();
    }
  }, [getNextPage, hasNextPage, loading]);

  return (
    <Modal heading={heading} isOpen={isOpen} onRequestClose={onRequestClose}>
      <div
        id="holder-list"
        className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto flex"
      >
        <div className="flex-1">
          <InfiniteScroll
            next={handleNext}
            dataLength={owners?.length || 0}
            hasMore={hasNextPage}
            loader={null}
            scrollableTarget="holder-list"
          >
            {owners?.map((value, index) => (
              <div
                className="mb-8 px-3 py-1 rounded-18 ellipsis hover:bg-hover-primary cursor-pointer"
                key={index}
                onClick={() => onAddressClick(value)}
              >
                {value}
              </div>
            ))}
            {loading && (
              <div className="[&>div]:mb-8">
                <LoaderItem />
                <LoaderItem />
                <LoaderItem />
                <LoaderItem />
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </Modal>
  );
}
