import { useState } from 'react';
import { Modal } from '../../Components/Modal';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { query } from '../../queries';
import { Tokens } from './Tokens';
import classNames from 'classnames';

function HolderCount() {
  return (
    <div
      className="px-4 py-5 flex items-center rounded-xl bg-tertiary"
      data-loader-type="block"
      data-loader-height="auto"
    >
      <img
        src="/images/temp.png"
        alt=""
        className="rounded-full w-[47px] h-[47px]"
      />
      <div className="pl-2.5">
        <div className="text-xl font-bold">673</div>
        <div className="text-text-secondary text-xs">own Bored Ringers</div>
      </div>
    </div>
  );
}

export function TokenHolders() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 3000);

  return (
    <Layout>
      <div className="flex flex-col mx-14 px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-14">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        <div className="my-5 text-text-secondary text-xl">
          Token balances of{' '}
          <span className="text-text-primary">vitalik.eth</span>
          <span
            className="text-text-button ml-3.5 text-sm cursor-pointer font-medium"
            onClick={() => setShowModal(true)}
          >
            Get API for this response
          </span>
        </div>
        <div
          className={classNames('flex flex-col justify-center', {
            'skeleton-loader': loading
          })}
        >
          <div className="flex w-full glass-effect rounded-lg overflow-hidden h-[421px]">
            <div
              className="border border-solid border-stroke-color bg-secondary rounded-lg p-5 m-2.5 flex-1 w-full"
              data-loader-type="block"
              data-loader-height="auto"
            >
              <h3 className="text-2xl mb-2">673 holders</h3>
              <div className="border-t-2 border-solid border-stroke-color"></div>
              <div className="grid grid-cols-2 gap-2.5 mt-5">
                <HolderCount />
                <HolderCount />
                <HolderCount />
              </div>
            </div>
            <div
              className="h-full flex-1 hidden sm:block"
              data-loader-type="block"
            ></div>
          </div>
          <div className="mt-10">
            <Tokens />
          </div>
        </div>
      </div>
      <Modal
        heading="Get API"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <pre className="w-[600px] max-h-[60vh] h-auto code rounded-xl p-5 overflow-auto">
          {query}
        </pre>
        <button className="bg-button-primary hover:bg-button-primary-hover mt-5 w-full py-4 font-bold rounded-md">
          Copy
        </button>
      </Modal>
    </Layout>
  );
}
