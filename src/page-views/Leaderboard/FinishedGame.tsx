export default function FinishedGame() {
  return (
    <div className="ml-0 sm:ml-16 mt-10 sm:mt-0 text-sm w-full sm:w-[340px] bg-primary border border-solid border-[#10365E] rounded-18 flex flex-col items-center justify-between overflow-hidden">
      <div className="p-5 text-center w-full flex-col-center text-sm font-semibold text-[#FFDE2E]">
        <div className="flex-row-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              d="M6.61182 16.0247C7.27768 16.8711 8.32372 17.4166 9.49998 17.4166C10.6762 17.4166 11.7223 16.8711 12.3881 16.0247C10.4709 16.2845 8.52908 16.2845 6.61182 16.0247Z"
              fill="#FFDE2E"
            />
            <path
              d="M14.843 7.12516V7.68257C14.843 8.35153 15.034 9.00553 15.3917 9.56207L16.2684 10.9261C17.0693 12.172 16.458 13.8653 15.0651 14.2593C11.4216 15.2899 7.57842 15.2899 3.93487 14.2593C2.54208 13.8653 1.93073 12.172 2.73154 10.9261L3.60826 9.56207C3.96603 9.00553 4.15694 8.35153 4.15694 7.68257V7.12516C4.15694 4.06459 6.54911 1.5835 9.5 1.5835C12.4509 1.5835 14.843 4.06459 14.843 7.12516Z"
              fill="#FFDE2E"
            />
          </svg>
          Round 2 starts 1 April, 2024.
        </div>
        <div className="mt-2">3M $DEGEN up for grabs!</div>
      </div>
      <div className="p-3 bg-token text-center text-text-secondary text-xs leading-[24px] w-full">
        Round 1 ended 26 March, 2024 at 12pm ET.<br/>300,000 $DEGEN were rewarded!
      </div>
    </div>
  );
}
