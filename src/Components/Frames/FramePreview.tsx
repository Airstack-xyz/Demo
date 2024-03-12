import classNames from 'classnames';
import { ReactNode } from 'react';
import { FrameLabel } from './FrameLabel';
import { LinkIcon } from './Icons';

export type FrameButton = {
  label: string;
  type: 'post' | 'link';
};

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
