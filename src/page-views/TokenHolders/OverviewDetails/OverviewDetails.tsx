import { Icon } from '../../../Components/Icon';
import { OverviewDetailsTokens } from './Tokens/Tokens';
import { imageAndSubTextMap } from '../Overview/imageAndSubTextMap';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Filters } from './Filters';
import { LoaderProvider } from '../../../context/loader';

export function OverviewDetails() {
  const [{ activeView, activeViewCount: count, activeViewToken }, setFilters] =
    useSearchInput();

  const handleGoBack = () => {
    setFilters(
      {
        activeView: '',
        activeViewCount: '',
        activeViewToken: '',
        tokenFilters: []
      },
      {
        updateQueryParams: true
      }
    );
  };

  return (
    <LoaderProvider>
      <div>
        <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
          <div className="flex items-center text-xs sm:text-base mx-w-[100%] sm:max-w-[80%] overflow-hidden">
            <div className="flex items-center w-[60%] sm:w-auto overflow-hidden">
              <div
                className="flex items-center cursor-pointer hover:bg-hover-primary px-2 py-1 rounded-full overflow-hidden"
                onClick={handleGoBack}
              >
                <Icon name="token-holders" height={20} width={20} />{' '}
                <span className="ml-1.5 text-text-secondary break-all cursor-pointer max-w-[90%] sm:max-w-[500px] ellipsis">
                  Holders of {activeViewToken}
                </span>
              </div>
              <span className="text-text-secondary">/</span>
            </div>
            <div className="flex items-center flex-1 px-2">
              <Icon name="table-view" height={20} width={20} className="mr-1" />{' '}
              <span className="ellipsis">
                {count === '0' ? '--' : count}{' '}
                {imageAndSubTextMap[activeView as string]?.subText}
              </span>
            </div>
          </div>
          <div className="w-auto">
            <Filters />
          </div>
        </div>
        <OverviewDetailsTokens />
      </div>
    </LoaderProvider>
  );
}
