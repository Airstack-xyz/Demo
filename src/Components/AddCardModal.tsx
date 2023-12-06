import React from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';

export function AddCardModal() {
  return (
    <Modal
      isOpen
      heading={
        <div className="text-lg">
          <div>You do not have enough free credits.</div>
          <div>Please add a card to download this file</div>
        </div>
      }
    >
      <div className="flex-col-center max-w-[565px] text-sm pt-1">
        <ul className="[&>li]:flex [&>li]:items-start [&>li]:mb-5 text-text-secondary">
          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              Your Airstack credits will be utilized for downloading CSV
              responses and API calls.
            </span>
          </li>
          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              You will be billed weekly at the rate of $0.00002 per credit,
              which is $1.99 for each 99,500 credit CSV download. Know more{' '}
              <a className="text-text-button font-semibold cursor-pointer">
                Know more
              </a>
            </span>
          </li>
          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              There are no monthly subscription fees. You only pay for what you
              use.
            </span>
          </li>
          <li></li>
        </ul>
        <button className="bg-button-primary px-10 rounded-full w-full flex-col-center justify-between text-white py-2">
          <span className="text-sm font-bold">Add card</span>
          <span className="text-xs">(you will be redirected to Stripe)</span>
        </button>
      </div>
    </Modal>
  );
}
