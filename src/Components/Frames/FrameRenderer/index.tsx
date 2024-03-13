import classNames from 'classnames';
import { LinkIcon } from '../Icons';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FrameState } from './types';
import Image from 'next/image';
import { fetchFrameData } from './utils';
import { debouncePromise } from '@/Components/Input/utils';

const initialFrameState: FrameState = {
  postUrl: '',
  buttons: [],
  image: '',
  imageAspectRatio: '1.91:1',
  inputText: ''
};

const FETCH_DELAY = 1500;

export function FrameRenderer({
  postUrl,
  containerClass,
  frameContainerClass,
  frameClass,
  initialContent,
  loadingContent,
  errorContent
}: {
  postUrl?: string;
  containerClass?: string;
  frameContainerClass?: string;
  frameClass?: string;
  initialContent?: ReactNode;
  loadingContent?: ReactNode;
  errorContent?: ReactNode;
}) {
  const [frameState, setFrameState] = useState(initialFrameState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { buttons, image, imageAspectRatio } = frameState;

  const fetchFrameDataFn = useCallback(async (url?: string, signal?: AbortSignal) => {
    if (!url) {
      return;
    }

    setLoading(true);
    setError(false);

    const { data, error } = await fetchFrameData({ url, signal });

    if (
      (error && error instanceof Error && error.name === 'AbortError') ||
      signal?.aborted
    ) {
      setLoading(false);
      return;
    }

    if (error) {
      setLoading(false);
      setError(true);
      return;
    }

    setFrameState(prev => ({ ...prev, ...data }));
    setLoading(false);
  }, []);

  const debouncedFetchDataFn = useMemo(
    () => debouncePromise(fetchFrameDataFn, FETCH_DELAY),
    [fetchFrameDataFn]
  );

  useEffect(() => {
    if (postUrl) {
      setLoading(true);
      debouncedFetchDataFn(postUrl);
    }
  }, [debouncedFetchDataFn, postUrl]);

  const renderFrameContent = () => {
    if (loading) {
      return (
        loadingContent || (
          <div className="my-auto flex-col-center gap-1 max-sm:text-base text-xl font-bold text-center">
            <Image alt="Logo" src="/logo-white.svg" height={32} width={32} />
            Generating preview...
          </div>
        )
      );
    }

    if (error) {
      return (
        errorContent || (
          <div className="my-auto flex-col-center gap-1 max-sm:text-base text-xl font-bold text-center">
            Something went wrong!
            <button
              type="button"
              className="hover:opacity-60"
              onClick={() => fetchFrameDataFn(postUrl)}
            >
              Retry
            </button>
          </div>
        )
      );
    }

    if (!image) {
      return (
        initialContent || (
          <div className="max-w-[400px] my-auto max-sm:text-base text-xl font-bold text-center">
            Please provide inputs to preview frame
          </div>
        )
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        className={classNames(
          'w-full',
          imageAspectRatio === '1:1' ? 'aspect-square' : 'aspect-[1.91/1]'
        )}
      />
    );
  };

  return (
    <div
      className={classNames(
        'text-text-secondary text-xs relative',
        containerClass
      )}
    >
      <div
        className={classNames(
          'flex flex-col overflow-hidden rounded-2xl border border-solid border-[#3D3041]',
          frameContainerClass
        )}
      >
        <div
          className={classNames(
            'flex-1 flex flex-col items-center text-white',
            imageAspectRatio === '1:1' ? 'aspect-square' : 'aspect-[1.91/1]',
            frameClass
          )}
        >
          {renderFrameContent()}
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
              {item.action === 'link' && (
                <LinkIcon className="inline ml-1 mb-[1px]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
