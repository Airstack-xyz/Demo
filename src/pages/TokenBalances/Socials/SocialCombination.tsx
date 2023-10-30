import classNames from 'classnames';
import { ReactNode, useMemo, useState } from 'react';
import { SocialSectionType } from './types';

const maxItemCount = 7;
const minItemCount = 1;

type SocialSectionProps = {
  name?: string;
  values: ReactNode[];
  type?: string;
  onAddressClick?: (value: unknown, type?: string) => void;
  onShowMoreClick?: (values: string[], type?: string) => void;
};

function SocialSection({
  name,
  values,
  type,
  onAddressClick,
  onShowMoreClick
}: SocialSectionProps) {
  const [showMax, setShowMax] = useState(false);

  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minItemCount);
    }
    return values?.slice(0, maxItemCount);
  }, [showMax, values]);

  return (
    <div className="grid grid-cols-2 mt-1.5 ml-[34px]">
      <div className="flex-1 text-text-secondary items-start my-1 ellipsis">
        {name}
      </div>
      <ul className="overflow-hidden">
        {items?.map((value, index) => (
          <li key={index} className="mb-1 last:mb-0 flex">
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
            className="text-text-button font-medium cursor-pointer px-3"
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
            className="text-text-button font-medium cursor-pointer px-3"
          >
            see all
          </li>
        )}
      </ul>
    </div>
  );
}

type SocialProps = {
  name: string;
  type?: string;
  image: string;
  sections?: SocialSectionType[];
  onAddressClick?: (value: unknown, type?: string) => void;
  onShowMoreClick?: (values: string[], type?: string) => void;
};

export function SocialCombination({
  name,
  type,
  sections,
  image,
  onAddressClick,
  onShowMoreClick
}: SocialProps) {
  return (
    <div className="text-sm mb-7 last:mb-0">
      <div className="flex items-center">
        <div className="rounded-full h-[25px] w-[25px] border mr-2 overflow-hidden flex-row-center">
          <img src={image} className="w-full" />
        </div>
        <span className="first-letter:uppercase">{name}</span>
      </div>
      {sections?.map(item => (
        <SocialSection
          key={item.name}
          name={item.name}
          values={item.values}
          type={type}
          onAddressClick={onAddressClick}
          onShowMoreClick={onShowMoreClick}
        />
      ))}
    </div>
  );
}
