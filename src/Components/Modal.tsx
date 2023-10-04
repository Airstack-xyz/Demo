import ReactModal from 'react-modal';
import { ReactNode, useEffect, useRef } from 'react';
import { Icon } from './Icon';

export type ModalProps = ReactModal.Props & {
  hideCloseButton?: boolean;
  hideDefaultContainer?: boolean;
  heading?: ReactNode;
};

export function Modal({
  children,
  hideCloseButton = false,
  hideDefaultContainer,
  heading,
  ...props
}: ModalProps) {
  const isOpenRef = useRef(props.isOpen);

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (isOpenRef.current) {
      // close if it was open before
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [props.isOpen]);

  return (
    <ReactModal
      overlayClassName="modal-overlay flex flex-col justify-center items-center fixed inset-0"
      className="bg-transparent min-h-[400px] min-w-[400px] outline-none"
      ariaHideApp={false}
      {...props}
    >
      {!hideCloseButton && (
        <div className="flex justify-end mb-1.5">
          <button
            onClick={props.onRequestClose}
            className="p-2 hover:bg-secondary rounded-md border border-transparent hover:border-solid hover:border-stroke-color"
          >
            <Icon name="close" width="18" height="19" />
          </button>
        </div>
      )}
      {hideDefaultContainer ? (
        children
      ) : (
        <div className="bg-glass p-5 border-solid-stroke rounded-xl">
          {heading && (
            <div>
              <h2 className="text-lg font-bold mb-3"> {heading} </h2>
            </div>
          )}
          {children}
        </div>
      )}
    </ReactModal>
  );
}
