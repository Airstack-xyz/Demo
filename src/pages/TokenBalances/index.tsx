import { useState } from 'react';
import { Modal } from '../../Components/Modal';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { query } from '../../queries';
import { Poaps } from './Poaps';
import { Socials } from './Socials';
import { Tokens } from './Tokens';

export function TokenBalance() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col px-14 pt-5 w-[1440px] max-w-[100vw]">
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
        <div className="flex justify-between">
          <Tokens />
          <aside className="w-80 ml-16">
            <Socials />
            <Poaps />
          </aside>
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
