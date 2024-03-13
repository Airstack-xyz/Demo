import { useNavigate } from '@/hooks/useNavigate';
import { memo, useCallback } from 'react';
import {
  SearchTabSection,
  TabUrl
} from '../../Components/Search/SearchTabSection';

export const Search = memo(function Search() {
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (pathname: TabUrl) => {
      navigate({
        pathname
      });
    },
    [navigate]
  );

  return (
    <div className="relative z-10">
      <SearchTabSection
        isHome={false}
        activeTab="token-balances"
        onTabChange={handleTabChange}
      />
    </div>
  );
});
