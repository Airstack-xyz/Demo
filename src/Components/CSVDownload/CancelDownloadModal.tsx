import { Modal } from '../Modal';

export function CancelDownloadModal(props: {
  onRequestClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      isOpen
      onRequestClose={props.onRequestClose}
      className="!w-[395px] min-w-[395px]"
    >
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold text-center mb-6">
          Are you sure you want to cancel the download?
        </h2>
        <div className="flex items-center justify-between mb-3">
          <button
            className="button-primary px-5 py-2.5 rounded-18 text-sm font-semibold flex-1 mr-2"
            onClick={props.onRequestClose}
          >
            Do not cancel
          </button>
          <button
            className="px-5 py-2.5 rounded-18 text-sm font-semibold border border-solid border-white flex-1"
            onClick={props.onConfirm}
          >
            Cancel download
          </button>
        </div>
      </div>
    </Modal>
  );
}
