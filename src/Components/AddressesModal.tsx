import { Modal } from './Modal';

type AddressesModalProps = {
  isOpen: boolean;
  modalValues: {
    leftValues: string[];
    rightValues: string[];
  };
  heading: string;
  onAddressClick: (address: string) => void;
  onRequestClose: () => void;
};

export function AddressesModal({
  heading,
  isOpen,
  modalValues,
  onAddressClick,
  onRequestClose
}: AddressesModalProps) {
  return (
    <Modal heading={heading} isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto flex">
        <div className="flex-1 max-w-[50%]">
          {modalValues.leftValues.map((value, index) => (
            <div
              className="mb-8 px-3 py-1 rounded-18 ellipsis hover:bg-glass cursor-pointer"
              key={index}
              onClick={() => onAddressClick(value)}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="border-l border-solid border-stroke-color flex-1 pl-5 max-w-[50%]">
          {modalValues.rightValues.map((value, index) => (
            <div
              className="mb-8 px-3 py-1 rounded-18 ellipsis hover:bg-glass cursor-pointer"
              key={index}
              onClick={() => onAddressClick(value)}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
