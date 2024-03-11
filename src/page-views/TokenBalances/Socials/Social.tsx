import classNames from 'classnames';
import { ReactNode, useMemo, useState } from 'react';
import { Image } from '@/Components/Image';

const maxItemCount = 7;
const minItemCount = 2;

type SocialProps = {
  name: string;
  type?: string;
  values: ReactNode[];
  image: string;
  onAddressClick?: (value: unknown, type?: string) => void;
  onShowMoreClick?: (values: string[], type?: string) => void;
};

export function Social({
  name,
  type,
  values,
  image,
  onAddressClick,
  onShowMoreClick
}: SocialProps) {
  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minItemCount);
    }
    return values?.slice(0, maxItemCount);
  }, [showMax, values]);

  return (
    <div className="text-sm mb-7 last:mb-0">
      <div className="flex">
        <div className="flex flex-1 items-start">
          <div className="flex items-center">
            <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
              <Image src={image} className="w-full" />
            </div>
            <span className="first-letter:uppercase">{name}</span>
          </div>
        </div>
        <ul className="text-text-secondary w-1/2 overflow-hidden flex flex-col justify-center">
          {items?.map((value, index) => (
            <li key={index} className="mb-2.5 last:mb-0 flex">
              <div
                className={classNames('px-3 py-1 rounded-18 ellipsis', {
                  'hover:bg-glass cursor-pointer': typeof value !== 'object'
                })}
                onClick={() => onAddressClick?.(value, type)}
              >
                {value}
              </div>
            </li>
          ))}
          {!showMax && values?.length > minItemCount && (
            <li
              onClick={() => {
                setShowMax(prev => !prev);
              }}
              className="text-text-button font-bold cursor-pointer px-3"
            >
              see more
            </li>
          )}
          {showMax && values.length > maxItemCount && (
            <li
              onClick={() => {
                if (showMax && values.length > maxItemCount) {
                  onShowMoreClick?.(values as string[], type);
                  return;
                }
              }}
              className="text-text-button font-bold cursor-pointer px-3"
            >
              see all
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
