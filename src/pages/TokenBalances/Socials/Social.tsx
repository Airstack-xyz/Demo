import { useState, useMemo, ReactNode, useCallback } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import classNames from 'classnames';

const maxSocials = 7;
const minSocials = 2;

type SocialProps = {
  name: string;
  values: ReactNode[];
  image: string;
  onShowMore?: () => void;
};

export function Social({ name, values, image, onShowMore }: SocialProps) {
  const [showMax, setShowMax] = useState(false);
  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minSocials);
    }
    return values?.slice(0, maxSocials);
  }, [showMax, values]);

  const setData = useSearchInput()[1];

  const getItemClickHandler = useCallback(
    (value: ReactNode) => () => {
      if (typeof value !== 'string') return;

      const isFarcaster = name.includes('farcaster');
      setData(
        {
          rawInput: isFarcaster ? `fc_fname:${value}` : value,
          address: isFarcaster ? [`fc_fname:${value}`] : [value],
          inputType: 'ADDRESS'
        },
        { updateQueryParams: true }
      );
    },
    [name, setData]
  );

  return (
    <div className="flex text-sm mb-7 last:mb-0">
      <div className="flex flex-1 items-start">
        <div className="flex items-center">
          <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
            <img src={image} className="w-full" />
          </div>
          <span className="first-letter:uppercase">{name}</span>
        </div>
      </div>
      <ul className="text-text-secondary w-1/2 overflow-hidden flex flex-col justify-center">
        {items?.map((value, index) => (
          <li key={index} className={classNames('mb-2.5 last:mb-0 flex')}>
            <div
              className={classNames('px-3 py-1 rounded-18 ellipsis', {
                'hover:bg-glass cursor-pointer': typeof value !== 'object'
              })}
              onClick={getItemClickHandler(value)}
            >
              {value}
            </div>
          </li>
        ))}
        {!showMax && values?.length > minSocials && (
          <li
            onClick={() => {
              setShowMax(show => !show);
            }}
            className="text-text-button font-bold cursor-pointer px-3"
          >
            see more
          </li>
        )}
        {showMax && values.length > maxSocials && (
          <li
            onClick={() => {
              if (showMax && values.length > maxSocials) {
                onShowMore?.();
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
  );
}
