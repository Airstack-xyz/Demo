import { Close } from './Icons';

export function FileReadyToDownload({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-toast-positive rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative">
      <span className="absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-toast-positive border-r-[10px] border-r-transparent border-t-transparent"></span>
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

export function PreparingFile() {
  return (
    <div className="rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative bg-stroke-highlight-blue">
      <span className="absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-b-stroke-highlight-blue border-r-[10px] border-r-transparent border-t-transparent"></span>
      <div>Preparing your file!</div>
      <div>We will notify you once it is ready.</div>
    </div>
  );
}

export function Failed() {
  return (
    <div className="rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative bg-toast-negative">
      <span className="absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-b-stroke-highlight-blue border-r-[10px] border-r-transparent border-t-transparent"></span>
      <div>Failed to prepare your file due to some error.</div>
      <div>Please try again.</div>
    </div>
  );
}
