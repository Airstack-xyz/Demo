import { Modal } from './Modal';

export function SignInModal(props: {
  onRequestClose: () => void;
  onLogin: () => void;
}) {
  return (
    <Modal
      isOpen
      onRequestClose={props.onRequestClose}
      className="w-[340px] min-w-[340px]"
      containerClassName="!border-white"
    >
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold text-center px-5 my-[30px]">
          Sign in to Airstack to download CSV
        </h2>
        <div className="text-center mb-[30px]">
          <button
            className="bg-button-primary px-5 py-2 rounded-18 text-sm font-semibold w-36"
            onClick={props.onLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </Modal>
  );
}
