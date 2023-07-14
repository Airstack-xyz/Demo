import { useCallback, useState } from 'react';
import { Modal } from '../../Components/Modal';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { Socials } from './Socials';
import { Tokens } from './Tokens';
import { ERC20Tokens } from './ERC20Tokens';
import { Filters } from './Filters';
import { SectionHeader } from './SectionHeader';
import { useSearchInput } from '../../hooks/useSearchInput';
import classNames from 'classnames';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { tokensQuery } from '../../queries';

function SocialsAndERC20() {
  return (
    <aside className="w-full sm:w-80 sm:ml-16">
      <Socials />
      <ERC20Tokens />
    </aside>
  );
}

export function TokenBalance() {
  const [showModal, setShowModal] = useState(false);
  const { address: query } = useSearchInput();
  const [showSocials, setShowSocials] = useState(false);
  const isMobile = isMobileDevice();

  const renderMobileTabs = useCallback(() => {
    return (
      <div className="mt-5 flex gap-10 mb-10 text-center sm:hidden border-b-4 border-solid border-stroke-color">
        <div
          onClick={() => setShowSocials(false)}
          className={classNames(
            'pb-2 flex-1 flex justify-center border-b-4 border-solid border-text-secondary -mb-1',
            {
              '!border-transparent': showSocials
            }
          )}
        >
          <SectionHeader iconName="nft-flat" heading="NFTs & POAPs" />
        </div>
        <div
          onClick={() => setShowSocials(true)}
          className={classNames(
            'pb-2 flex-1 flex justify-center border-b-4 border-solid border-text-secondary -mb-1',
            {
              '!border-transparent': !showSocials
            }
          )}
        >
          <SectionHeader iconName="nft-flat" heading="Socials & ERC20" />
        </div>
      </div>
    );
  }, [showSocials]);

  return (
    <Layout>
      <div className="flex flex-col px-2 pt-5 w-[1440px] max-w-[100vw] sm:pt-14">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        {query && (
          <>
            <div className="flex-col-center my-3">
              <button
                className="py-2 px-5 text-text-button bg-secondary rounded-full text-xs font-medium"
                onClick={() => setShowModal(true)}
              >
                Get API
              </button>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="hidden sm:block">
                  <SectionHeader iconName="nft-flat" heading="NFTs & POAPs" />
                </div>
                {isMobile && renderMobileTabs()}
                <div className="mt-3.5 mb-5">
                  <Filters />
                </div>
                <Tokens />
              </div>
              <SocialsAndERC20 />
              {/* <div className="flex justify-between">
              {isMobile ? (
                showSocials ? (
                  <SocialsAndERC20 />
                ) : (
                  <Tokens />
                )
              ) : (
                <Tokens />
              )}
              {!isMobile && <SocialsAndERC20 />}
            </div> */}
            </div>
          </>
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
