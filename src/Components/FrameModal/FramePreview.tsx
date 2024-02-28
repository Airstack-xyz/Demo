import classNames from 'classnames';
import { ReactNode, SVGProps } from 'react';
import { FrameLabel } from './FrameLabel';

export type FrameButton = {
  label: string;
  type: 'post' | 'link';
};

function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="12"
      fill="none"
      viewBox="0 0 13 12"
      {...props}
    >
      <g clipPath="url(#a)">
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
            strokeLinecap="round"
            strokeLinejoin="round"
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
  frameContainerClass,
  frameClass,
  children
}: {
  buttons?: FrameButton[];
  containerClass?: string;
  frameContainerClass?: string;
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
      <FrameLabel label="Preview" labelIcon="frame" labelIconSize={16} />
      <div
        className={classNames(
          'flex flex-col overflow-hidden rounded-2xl border border-solid border-[#3D3041]',
          frameContainerClass
        )}
      >
        <div
          className={classNames(
            'flex-1 flex flex-col items-center aspect-square',
            frameClass
          )}
        >
          {children}
        </div>
        <div
          className={classNames(
            'flex justify-center items-stretch gap-2.5 text-white max-sm:min-h-[44px] min-h-[52px] py-2 px-4',
            buttons?.length ? 'bg-[#292431]' : ''
          )}
        >
          {buttons?.map(item => (
            <button
              key={item.label}
              type="button"
              className="inline ellipsis h-[36px] w-full flex-1 cursor-default gap-1 rounded-lg border border-solid border-[#473B4B] bg-[#3F3A46] px-3 text-sm font-semibold max-sm:h-[28px] max-sm:px-2 max-sm:text-[10px]"
            >
              {item.label}
              {item.type === 'link' && (
                <LinkIcon className="inline ml-1 mb-[1px]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
