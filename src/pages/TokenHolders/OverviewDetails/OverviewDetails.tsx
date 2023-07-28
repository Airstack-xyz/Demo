import { Icon } from '../../../Components/Icon';
import { OverviewDetailsTokens } from './Tokens/Tokens';
import { imageAndSubTextMap } from '../Overview/imageAndSubTextMap';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Filters } from './Filters';
import { LoaderProvider } from '../../../context/loader';

export function OverviewDetails() {
  const [{ activeView, activeViewCount: count, activeViewToken }] =
    useSearchInput();

  return (
    <LoaderProvider>
      <div>
        <div className="flex items-center justify-between mb-4 mt-7 px-2 sm:px-0">
          <div className="flex items-center text-xs sm:text-base">
            <Icon name="token-holders" height={20} width={20} />{' '}
            <div className="flex items-center max-w-[50%] sm:max-w-none">
              <span className="ml-1.5 text-text-secondary break-all">
                Holders of {activeViewToken}
              </span>
              <span className="mx-2.5 text-text-secondary">/</span>
            </div>
            <div className="flex items-center">
              <Icon name="table-view" height={20} width={20} className="mr-1" />{' '}
              {count === '0' ? '--' : count}{' '}
              {imageAndSubTextMap[activeView as string]?.subText}
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
