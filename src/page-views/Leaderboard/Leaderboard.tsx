import { Tab, TabContainer } from '@/Components/Tab';
import { FAQs } from './FAQs';
import { LeaderboardTable } from './LeaderboardTable';
import { useState } from 'react';
import { isMobileDevice } from '@/utils/isMobileDevice';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'faq'>(
    'leaderboard'
  );
  const isMobile = isMobileDevice();
  return (
    <div className="content px-3 sm:px-0">
      <h1 className="text-2xl sm:text-[40px] font-semibold mb-8 sm:mb-12 pt-5 sm:pt-7">
        Airstack Points Leaderboard
      </h1>
      {!isMobile && (
        <div className="flex flex-col sm:flex-row items-start">
          <LeaderboardTable />
          <FAQs />
        </div>
      )}
      {isMobile && (
        <>
          <TabContainer>
            <Tab
              icon="leaderboard"
              header="Leaderboard"
              className="text-xs"
              iconClassName="!size-4"
              active={activeTab === 'leaderboard'}
              onClick={() => {
                setActiveTab('leaderboard');
              }}
            />
            <Tab
              icon="faq"
              header="FAQs"
              className="text-xs"
              iconClassName="!size-4"
              active={activeTab === 'faq'}
              onClick={() => {
                setActiveTab('faq');
              }}
            />
          </TabContainer>
          {activeTab === 'faq' && <FAQs />}
          {activeTab === 'leaderboard' && <LeaderboardTable />}
        </>
      )}
    </div>
  );
}
