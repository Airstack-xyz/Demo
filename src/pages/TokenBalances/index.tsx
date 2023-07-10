import { useState } from 'react';
import { Modal } from '../../Components/Modal';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { Socials } from './Socials';
import { Tokens } from './Tokens';
import { ERC20Tokens } from './ERC20Tokens';
import { Filters } from './Filters';
import { SectionHeader } from './SectionHeader';
import { useSearchInput } from '../../hooks/useSearchInput';

export function TokenBalance() {
  const [showModal, setShowModal] = useState(false);
  const { query } = useSearchInput();
  return (
    <Layout>
      <div className="flex flex-col px-14 pt-5 w-[1440px] max-w-[100vw]">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        {query && (
          <div>
            <div className="mt-5">
              <SectionHeader iconName="nft-flat" heading="Tokens" />
            </div>
            <div className="my-3.5">
              <Filters />
            </div>
            <div className="flex justify-between">
              <Tokens />
              <aside className="w-80 ml-16">
                <Socials />
                <ERC20Tokens />
              </aside>
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
          {query}
        </pre>
        <button className="bg-button-primary hover:bg-button-primary-hover mt-5 w-full py-4 font-bold rounded-md">
          Copy
        </button>
      </Modal>
    </Layout>
  );
}
