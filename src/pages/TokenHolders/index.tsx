import React, { useState } from 'react';
import { Modal } from '../../Components/Modal';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { tokensQuery } from '../../queries';
import { Tokens } from './Tokens/Tokens';
import { HoldersOverview } from './Overview/Overview';
import { useSearchInput } from '../../hooks/useSearchInput';

export function TokenHolders() {
  const [showModal, setShowModal] = useState(false);
  const { query } = useSearchInput();
  return (
    <Layout>
      <div className="flex flex-col mx-14 px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-14">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        {query && (
          <div className="flex flex-col justify-center mt-7">
            <HoldersOverview />
            <div className="mt-10">
              <Tokens />
            </div>
          </div>
        )}
      </div>
      <Modal
        heading="Get API"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <pre className="w-[600px] max-h-[60vh] h-auto code rounded-xl p-5 overflow-auto">
          {tokensQuery}
        </pre>
        <button className="bg-button-primary hover:bg-button-primary-hover mt-5 w-full py-4 font-bold rounded-md">
          Copy
        </button>
      </Modal>
    </Layout>
  );
}
