import classNames from 'classnames';
import { Icon } from '../Icon';
import { ReactNode } from 'react';

export type FrameButton = {
  label: string;
  type: 'post' | 'link';
};

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="12"
      fill="none"
      viewBox="0 0 13 12"
    >
      <g clip-path="url(#a)">
        <mask
          id="b"
          width="13"
          height="12"
          x="0"
          y="0"
          maskUnits="userSpaceOnUse"
        >
          <path fill="#fff" d="M12.3398 0h-12v12h12V0Z" />
        </mask>
        <g mask="url(#b)">
          <path
            stroke="#8B8EA0"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.8398 4.5v-3m0 0h-3m3 0-4.5 4.5m-1-4.5h-1.1c-.84 0-1.26 0-1.581.1635a1.5 1.5 0 0 0-.6555.6555c-.1635.3209-.1635.741-.1635 1.581v4.2c0 .8401 0 1.2601.1635 1.581.1438.2823.3733.5117.6556.6555.3208.1635.7409.1635 1.581.1635h4.2c.84 0 1.26 0 1.5809-.1635a1.4995 1.4995 0 0 0 .6555-.6555c.1635-.3209.1635-.7409.1635-1.581V7"
          />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h12v12H0z" transform="translate(.3398)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function FramePreview({
  buttons,
  containerClass,
  frameClass,
  children
}: {
  buttons?: FrameButton[];
  containerClass?: string;
  frameClass?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={classNames(
        'text-text-secondary text-xs relative',
        containerClass
      )}
    >
      <div className="flex items-center gap-1 mb-2">
        <Icon name="frame" height={16} width={16} />
        <span className="font-semibold">Preview</span>
      </div>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-solid border-[#3D3041]">
        <div
          className={classNames(
            'flex-1 flex flex-col items-center aspect-square',
            frameClass
          )}
        >
          {children}
        </div>
        {!!buttons && (
          <div className="py-2 px-4 bg-[#292431] flex justify-center items-stretch gap-2.5 text-white">
            {buttons.map(item => (
              <button
                key={item.label}
                type="button"
                className="flex-row-center max-sm:h-[28px] h-[36px] w-full gap-1 rounded-lg border border-solid border-[#473B4B] bg-[#3F3A46] max-sm:px-2 px-3 max-sm:text-[10px] text-sm font-semibold cursor-default"
              >
                <span className="ellipsis max-w-[120px]">{item.label}</span>
                {item.type === 'link' && <LinkIcon />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
