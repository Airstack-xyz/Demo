import { Modal } from './Modal';

type AddressesModalProps = {
  isOpen: boolean;
  heading: string;
  addresses: string[];
  dataType?: string;
  onAddressClick: (address: string, dataType?: string) => void;
  onRequestClose: () => void;
};

export function AddressesModal({
  isOpen,
  heading,
  addresses,
  dataType,
  onAddressClick,
  onRequestClose
}: AddressesModalProps) {
  return (
    <Modal heading={heading} isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto grid grid-cols-2 auto-rows-max gap-y-5 gap-x-2">
        {addresses.map((address, index) => (
          <div
            key={index}
            className="px-3 py-1 rounded-18 ellipsis hover:bg-glass cursor-pointer"
            onClick={() => onAddressClick(address, dataType)}
          >
            {address}
          </div>
        ))}
      </div>
    </Modal>
  );
}
