import { memo, useCallback, useMemo, useState } from 'react';
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
import { createAppUrlWithQuery } from '../../utils/createAppUrlWithQuery';
import { POAPQuery, SocialQuery, TokensQuery } from '../../queries';
import { tokenTypes } from './constants';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';

const SocialsAndERC20 = memo(function SocialsAndERC20() {
  return (
    <aside className="w-full min-w-full sm:w-[305px] sm:min-w-[305px] sm:ml-16">
      <Socials />
      <ERC20Tokens />
    </aside>
  );
});

export function TokenBalance() {
  const [{ address: query, tokenType }] = useSearchInput();
  const [showSocials, setShowSocials] = useState(false);
  const isMobile = isMobileDevice();

  const options = useMemo(() => {
    const nftLink = createAppUrlWithQuery(TokensQuery, {
      owner: query,
      limit: 10,
      tokenType: tokenType
        ? [tokenType]
        : tokenTypes.filter(tokenType => tokenType !== 'POAP')
    });

    const poapLink = createAppUrlWithQuery(POAPQuery, {
      owner: query,
      limit: 10
    });

    const socialLink = createAppUrlWithQuery(SocialQuery, {
      identity: query
    });

    const options = [];

    if (tokenType !== 'POAP') {
      options.push({
        label: 'Token Balances',
        link: nftLink
      });
    }

    if (!tokenType || tokenType === 'POAP') {
      options.push({
        label: 'POAPs',
        link: poapLink
      });
    }

    options.push({
      label: 'Socials, Domains & XMTP',
      link: socialLink
    });
    return options;
  }, [query, tokenType]);

  const renderMobileTabs = useCallback(() => {
    return (
      <div className="mt-5 flex gap-5 mb-5 text-center sm:hidden border-b-4 border-solid border-stroke-color text-sm">
        <div
          onClick={() => setShowSocials(false)}
          className={classNames(
            'pb-2 flex-1 flex justify-center border-b-4 border-solid border-text-secondary -mb-1',
            {
              '!border-transparent [&>div]:font-normal  text-text-secondary':
                showSocials
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
              '!border-transparent [&>div]:font-normal text-text-secondary':
                !showSocials
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
      <div className="flex flex-col px-2 pt-5 w-[1440px] max-w-[100vw] sm:pt-8">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        {query && (
          <>
            <div className="hidden sm:flex-col-center my-3">
              <GetAPIDropdown options={options} />
            </div>
            <div className="flex justify-between px-5">
              <div className="w-full h-full" key={query}>
                <div className="hidden sm:block">
                  <SectionHeader iconName="nft-flat" heading="NFTs & POAPs" />
                </div>
                {isMobile && renderMobileTabs()}
                <div className="mt-3.5 mb-5">
                  {(!isMobile || !showSocials) && <Filters />}
                </div>
                {isMobile ? (
                  showSocials ? (
                    <SocialsAndERC20 />
                  ) : (
                    <Tokens />
                  )
                ) : (
                  <Tokens />
                )}
              </div>
              {!isMobile && <SocialsAndERC20 />}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
