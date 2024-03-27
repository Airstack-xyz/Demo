import { Tab, TabContainer } from '@/Components/Tab';
import { isMobileDevice } from '@/utils/isMobileDevice';
import { useState } from 'react';
import { FAQs } from './FAQs';
import { LeaderboardTable } from './LeaderboardTable';
import FinishedGame from './FinishedGame';

type LeaderboardTab = 'leaderboard' | 'faq';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('leaderboard');
  const isMobile = isMobileDevice();
  return (
    <div className="content px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8 mb-8 sm:mb-12 pt-5 sm:pt-7">
        <h1 className="text-xl sm:text-[40px] font-semibold">
          Airstack Points Leaderboard
        </h1>
        <div className="flex items-center gap-4 mt-1">
          <a
            href="https://warpcast.com/betashop.eth/0xf2cbf1e5"
            target="_blank"
            className="flex items-center gap-1 px-4 py-2 dropdown-bg hover:bg-[#14273880] text-xs font-medium text-text-button rounded-18"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M1.5 14C1.5 14.5523 1.94771 15 2.49999 15H13.5C14.0523 15 14.5 14.5523 14.5 14V3C14.5 2.44771 14.0523 2 13.5 2H2.49999C1.94771 2 1.5 2.44771 1.5 2.99999V14ZM12.6875 2.92857C13.2398 2.92857 13.6875 3.37628 13.6875 3.92857V13.0714C13.6875 13.6237 13.2398 14.0714 12.6875 14.0714H3.3125C2.76021 14.0714 2.3125 13.6237 2.3125 13.0714V3.92857C2.3125 3.37628 2.76021 2.92857 3.3125 2.92857H12.6875Z"
                fill="#82B6FF"
              />
              <path
                d="M11.1287 11.3436V11.2849C11.1287 11.1338 11.0406 11.0037 10.9189 10.9324H10.9315V7.13434L11.2211 6.2908H10.0921V5.44727H5.89964V6.2908H4.77072L5.0603 7.13434V10.9324H5.07289C4.94698 11.0037 4.86305 11.1296 4.86305 11.2849V11.3436C4.73295 11.3982 4.64062 11.5283 4.64062 11.6836V11.7465H7.15865V11.6836C7.15865 11.5325 7.06632 11.4024 6.93622 11.3436V11.2849C6.93622 11.1338 6.84809 11.0037 6.72639 10.9324H6.74317V9.03125C6.74317 8.35558 7.28875 7.80581 7.96022 7.80581H8.03576C8.70723 7.80581 9.2528 8.35558 9.2528 9.03125V10.9324H9.26959C9.14369 11.0037 9.05976 11.1296 9.05976 11.2849V11.3436C8.92966 11.3982 8.83733 11.5283 8.83733 11.6836V11.7465H11.3554V11.6836C11.3554 11.5325 11.263 11.4024 11.1329 11.3436H11.1287Z"
                fill="#82B6FF"
              />
            </svg>
            View Frame
          </a>
          <a
            href="https://warpcast.com/~/compose?embeds%5B%5D=https%3A%2F%2Fframes.airstack.xyz%2Ftt&text=hihi%2C+see+what+tokens+are+trending+right+now+on+Farcaster"
            target="_blank"
            className="flex items-center gap-1 px-4 py-2 dropdown-bg hover:bg-[#14273880] text-xs font-medium text-text-button rounded-18"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7698 14.4231C10.8776 14.4231 10.1544 13.6999 10.1544 12.8077C10.1544 11.9155 10.8776 11.1923 11.7698 11.1923C12.6621 11.1923 13.3852 11.9155 13.3852 12.8077C13.3852 13.6999 12.6621 14.4231 11.7698 14.4231ZM4.23137 10.1154C3.33914 10.1154 2.61599 9.39223 2.61599 8.5C2.61599 7.60831 3.33914 6.88462 4.23137 6.88462C5.1236 6.88462 5.84676 7.60831 5.84676 8.5C5.84676 9.39223 5.1236 10.1154 4.23137 10.1154ZM11.7698 2.57692C12.6621 2.57692 13.3852 3.30008 13.3852 4.19231C13.3852 5.08454 12.6621 5.80769 11.7698 5.80769C10.8776 5.80769 10.1544 5.08454 10.1544 4.19231C10.1544 3.30008 10.8776 2.57692 11.7698 2.57692ZM11.7698 10.1154C10.8168 10.1154 9.98483 10.6135 9.50613 11.3603L6.62268 9.71262C6.80899 9.34647 6.92368 8.93831 6.92368 8.5C6.92368 8.22915 6.87146 7.97284 6.79715 7.72622L9.79691 6.01231C10.2885 6.54539 10.9874 6.88462 11.7698 6.88462C13.2571 6.88462 14.4621 5.67954 14.4621 4.19231C14.4621 2.70508 13.2571 1.5 11.7698 1.5C10.2826 1.5 9.07752 2.70508 9.07752 4.19231C9.07752 4.46315 9.12975 4.71946 9.20405 4.96661L6.20429 6.68C5.71268 6.14746 5.01375 5.80769 4.23137 5.80769C2.74414 5.80769 1.53906 7.01277 1.53906 8.5C1.53906 9.98723 2.74414 11.1923 4.23137 11.1923C4.84522 11.1923 5.40467 10.9791 5.85752 10.6334L5.84676 10.6538L9.10714 12.5169C9.09637 12.6139 9.07752 12.7075 9.07752 12.8077C9.07752 14.2949 10.2826 15.5 11.7698 15.5C13.2571 15.5 14.4621 14.2949 14.4621 12.8077C14.4621 11.3205 13.2571 10.1154 11.7698 10.1154Z"
                fill="#82B6FF"
              />
            </svg>
            Share Frame
          </a>
        </div>
      </div>
      {!isMobile && (
        <div className="flex flex-col sm:flex-row items-start">
          <LeaderboardTable />
          <div>
            <FinishedGame />
            <FAQs />
          </div>
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
          {activeTab === 'faq' && (
            <>
              <FinishedGame />
              <FAQs />
            </>
          )}
          {activeTab === 'leaderboard' && <LeaderboardTable />}
        </>
      )}
    </div>
  );
}
