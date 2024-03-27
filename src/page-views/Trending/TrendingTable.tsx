import { Icon } from '@/Components/Icon';
import { TrendingMint, TrendingToken } from './types';
import LazyImage from '@/Components/LazyImage';
import classNames from 'classnames';
import { createTokenHolderUrl } from '@/utils/createTokenUrl';
import { Link } from '@/Components/Link';

type TableProps = {
  items: (TrendingToken | TrendingMint)[];
  loading: boolean;
};

const loaderData = Array.from({ length: 5 }).map(
  (_, index) => ({})
) as TrendingToken[];

export function TrendingTable({ items, loading }: TableProps) {
  return (
    <ul className="border border-solid border-stroke-color-light mt-5 rounded-18 flex flex-col overflow-hidden">
      {(loading ? loaderData : items).map((item, index) => {
        const tokenNft = item?.token?.tokenNfts?.find(
          v => v.contentValue?.image?.medium
        );

        const image =
          tokenNft?.contentValue?.image?.medium ||
          item?.token?.logo?.medium ||
          '/images/token-placeholder.svg';

        const criteriaCount = item?.criteriaCount || 0;
        const name = item?.token?.name;

        const tokenHolderUrl = createTokenHolderUrl({
          address: item.address || '',
          inputType: 'ADDRESS',
          type: item.token?.type || '',
          blockchain: item.blockchain || '',
          label: name || '--'
        });

        return (
          <li
            key={index}
            className={classNames('px-5', {
              'skeleton-loader py-3 my-2': loading,
              'even:bg-secondary py-5': !loading
            })}
            data-loader-type="block"
          >
            <Link
              to={tokenHolderUrl}
              className="flex items-center justify-between "
            >
              <div className="flex-row-center text-sm flex-1 overflow-hidden">
                <span>{index + 1}</span>
                <span className="size-6 mx-1.5">
                  <LazyImage
                    src={image}
                    className="absolute size-6 aspect-square overflow-hidden object-cover rounded-18"
                  />
                </span>
                <span className="flex-1 ellipsis">{item?.token?.name}</span>
              </div>
              <div className="text-xs">
                <div
                  className="flex items-center gap-1.5 px-2 py-1 bg-glass text-sm rounded-18"
                  style={{ textShadow: 'rgba(0, 0, 0, 0.4) 0px 0px 2px' }}
                >
                  {criteriaCount}
                  <Icon name="token-balances" height={16} width={16} />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
