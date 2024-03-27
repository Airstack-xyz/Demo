import { Icon, IconType } from '@/Components/Icon';
import { Link } from '@/Components/Link';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { HeadingWithIcon } from './HeadingWithIcon';

export type TrendingHorizontalListProps<D> = {
  title: string;
  icon: IconType;
  data: D[];
  onItemClick: (item: any) => void;
  viewAllLink: string;
  getApiLink: string;
  onViewFrameClick: () => void;
  renderItem: (item: D, index: number) => JSX.Element;
  loading?: boolean;
};

function IconNext() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M15.9993 29.3346C23.3631 29.3346 29.3327 23.365 29.3327 16.0013C29.3327 8.6375 23.3631 2.66797 15.9993 2.66797C8.63555 2.66797 2.66602 8.6375 2.66602 16.0013C2.66602 23.365 8.63555 29.3346 15.9993 29.3346Z"
        stroke="white"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.3203 20.7063L19.0136 15.9996L14.3203 11.293"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M16.0007 29.3346C8.63692 29.3346 2.66732 23.365 2.66732 16.0013C2.66732 8.6375 8.63692 2.66797 16.0007 2.66797C23.3645 2.66797 29.334 8.6375 29.334 16.0013C29.334 23.365 23.3645 29.3346 16.0007 29.3346Z"
        stroke="white"
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.6797 20.7063L12.9864 15.9996L17.6797 11.293"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

const ITEMS_PER_PAGE = 3;
export function TrendingHorizontalList<D>({
  title,
  icon,
  data,
  onItemClick,
  viewAllLink,
  getApiLink,
  onViewFrameClick,
  renderItem,
  loading
}: TrendingHorizontalListProps<D>) {
  const [currentPage, setPage] = useState(0);
  const items = useMemo(() => {
    return data.slice(
      currentPage * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [data, currentPage]);

  const onNext = () => {
    setPage(currentPage + 1);
  };

  const onPrev = () => {
    setPage(currentPage - 1);
  };

  const isLastPage = data.length <= (currentPage + 1) * ITEMS_PER_PAGE;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex-row-center">
          <HeadingWithIcon icon={icon} title={title} />
          <Link
            to={viewAllLink}
            className="text-xs font-medium text-text-button p-1 mt-1"
          >
            View all {'->'}
          </Link>
        </div>
        <div className="flex-row-center">
          <button
            className={classNames(
              'py-1.5 px-3 text-text-button button-filter rounded-full text-xs font-medium flex-row-center gap-1.5'
              //   {
              //     'border-white': isDropdownVisible,
              //     'cursor-not-allowed pointer-events-none opacity-80': disabled
              //   }
            )}
            // onClick={
            //   showDesktopNudgeModal ? handleModalOpen : handleDropdownToggle
            // }
            // disabled={disabled}
          >
            <Icon name="get-api" height={16} width={16} />
            Get API
          </button>
          <button className="py-1.5 px-3 button-filter rounded-full flex-row-center ml-3.5">
            <Icon name="get-frame" height={16} width={16} />
          </button>
          <button
            className="hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ml-7"
            onClick={onPrev}
            disabled={loading || currentPage === 0}
          >
            <IconPrev />
          </button>
          <button
            className="hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ml-5"
            onClick={onNext}
            disabled={loading || isLastPage}
          >
            <IconNext />
          </button>
        </div>
      </div>
      <div className="w-full">
        <ul className="flex items-center gap-10">
          {items.map((item, index) => (
            <li key={index} onClick={() => onItemClick(item)}>
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
