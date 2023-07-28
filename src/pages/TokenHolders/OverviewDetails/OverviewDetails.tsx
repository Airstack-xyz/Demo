import { Icon } from '../../../Components/Icon';
import { OverviewDetailsTokens } from './Tokens/Tokens';
import { imageAndSubTextMap } from '../Overview/imageAndSubTextMap';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { Filters } from './Filters';

export function OverviewDetails() {
  const [{ activeView, activeViewCount: count, activeViewToken }] =
    useSearchInput();

  return (
    <div>
      <div className="flex items-center justify-between mb-4 mt-7">
        <div className="flex items-center">
          <Icon name="token-holders" height={20} width={20} />{' '}
          <span className="ml-1.5 text-text-secondary">
            Token Holders of {activeViewToken}
            <span className="mx-2.5">/</span>
          </span>
          <span className="flex items-center">
            <Icon name="table-view" height={20} width={20} className="mr-1" />{' '}
            {count || ''} {imageAndSubTextMap[activeView as string]?.subText}
          </span>
        </div>
        <div className="w-auto">
          <Filters />
        </div>
      </div>
      <OverviewDetailsTokens />
    </div>
  );
}
