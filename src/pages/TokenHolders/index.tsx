import React from 'react';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { Tokens } from './Tokens/Tokens';
import { HoldersOverview } from './Overview/Overview';
import { useSearchInput } from '../../hooks/useSearchInput';

export function TokenHolders() {
  const { address: query } = useSearchInput();
  return (
    <Layout>
      <div className="flex flex-col px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-8">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        {query && (
          <>
            <div className="hidden sm:flex-col-center my-3">
              <a
                className="py-2 px-5 text-text-button bg-secondary rounded-full text-xs font-medium"
                href="https://app.airstack.xyz/query/WcNa6kVeXH"
                target="_blank"
              >
                View graphql query
              </a>
            </div>
            <div className="flex flex-col justify-center mt-7" key={query}>
              <HoldersOverview />
              <div className="mt-10">
                <Tokens />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
