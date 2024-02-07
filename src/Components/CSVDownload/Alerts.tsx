import { useEffect } from 'react';
import { Close } from './Icons';
import classNames from 'classnames';

const containerClassName =
  'rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative';
const arrowClassName =
  'absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-r-[10px] border-r-transparent border-t-transparent';
export function FileReadyToDownload({ onClose }: { onClose: () => void }) {
  return (
    <div className={classNames('bg-toast-positive', containerClassName)}>
      <span
        className={classNames('border-toast-positive', arrowClassName)}
      ></span>
      <div className="flex items-center">
        <span>Your file is ready to be downloaded</span>
        <span
          className="ml-2 hover:cursor-pointer"
          onClick={() => {
            onClose();
          }}
        >
          <Close />
        </span>
      </div>
    </div>
  );
}

export function PreparingFile({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={classNames('bg-stroke-highlight-blue', containerClassName)}>
      <span
        className={classNames('border-b-stroke-highlight-blue', arrowClassName)}
      ></span>
      <div>Preparing your file!</div>
      <div>We will notify you once it is ready.</div>
    </div>
  );
}

export function Failed({ onClose }: { onClose: () => void }) {
  return (
    <div className={classNames('bg-toast-negative', containerClassName)}>
      <span
        className={classNames('border-b-toast-negative', arrowClassName)}
      ></span>
      <div className="flex items-start">
        <div>
          <div>Failed to prepare your file due to some error.</div>
          <div>Please try again.</div>
        </div>
        <span
          className="ml-3 hover:cursor-pointer mt-2"
          onClick={() => {
            onClose();
          }}
        >
          <Close />
        </span>
      </div>
    </div>
  );
}
