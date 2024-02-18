import React from 'react';
import { Modal } from './Modal';
import { useAuth } from '../hooks/useAuth';

const heading = 'Sign in to Airstack to download CSV';

export function SignInToDownloadCSV() {
  const { login } = useAuth();
  return (
    <Modal
      isOpen
      heading={<div className="text-center text-lg w-full">{heading}</div>}
    >
      <div className="flex-col-center text-center">
        <h2 className="text-center clear-left mb-[14px] text-text-secondary text-sm">
          <span>Your credits will be used for each download.</span>
          <br />
          <a className="text-text-button font-semibold cursor-pointer">
            Click here
          </a>{' '}
          to learn more.
        </h2>
        <div className="bg-[#1A5491] py-1 px-1.5 rounded-md mb-[22px] text-xs">
          New users signing up with ENS, Farcaster or Lens get 5M free credits!
        </div>
        <button
          className="bg-button-primary h-10 px-10 rounded-full text-sm font-semibold"
          onClick={() => {
            login();
          }}
        >
          Sign In
        </button>
      </div>
    </Modal>
  );
}
