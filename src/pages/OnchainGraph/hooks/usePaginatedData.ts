import { useCallback, useMemo, useState } from 'react';
import { useOnchainGraphContext } from './useOnchainGraphContext';

const ITEM_PER_PAGE = 30;

export function usePaginatedData() {
  const [lastItemIndex, setLastItemIndex] = useState(ITEM_PER_PAGE);
  const { data } = useOnchainGraphContext();

  const paginatedData = useMemo(() => {
    if (data) {
      return data.slice(0, lastItemIndex);
    }
    return [];
  }, [lastItemIndex, data]);

  const getNextPage = useCallback(() => {
    setLastItemIndex(prev => prev + ITEM_PER_PAGE);
  }, []);

  return [paginatedData, lastItemIndex >= data.length, getNextPage] as const;
}
