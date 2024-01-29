import React from 'react';
import { Modal } from '../Modal';
import { Icon } from '../Icon';

export function AddCardModal() {
  return (
    <Modal
      isOpen
      heading={
        <div className="text-lg">
          <div>Please add a card to download this file</div>
        </div>
      }
    >
      <div className="flex-col-center max-w-[565px] text-sm pt-1">
        <ul className="[&>li]:flex [&>li]:items-start [&>li]:mb-5 text-text-secondary">
          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              It is free to browse Airstack. We only charge for CSV downloads
              and API requests.
            </span>
          </li>

          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              The are no recurring fees. You only pay for what you use.
            </span>
          </li>
          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              Your card will be charged once-per-week $0.00002 per credit used.
              If you do not use the service during a weekly period, there will
              be no charges.
            </span>
          </li>
          <li>
            <Icon name="check-mark-circle" className="mt-1 w-[14px]" />
            <span className="ml-1.5">
              All charges will be made clear before purchase.
              <a className="text-text-button ml-1 cursor-pointer">Know more</a>
            </span>
          </li>
        </ul>
        <button className="bg-button-primary px-10 rounded-full w-full flex-col-center justify-between text-white py-2">
          <span className="text-sm font-bold">Add card</span>
          <span className="text-xs">(you will be redirected to Stripe)</span>
        </button>
      </div>
    </Modal>
  );
}
