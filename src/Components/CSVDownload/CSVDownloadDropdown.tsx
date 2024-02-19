import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useEstimateTask } from '../../hooks/useEstimateTask';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { CSVDownloadOption } from '../../types';
import { isMobileDevice } from '../../utils/isMobileDevice';
import { Modal } from '../Modal';

function CodeIconBlue() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M11 8L8 11M8 11L5 8M8 11V2M14.75 11V12.5C14.75 13.3284 14.0785 14 13.25 14H2.75C1.92157 14 1.25 13.3284 1.25 12.5V11"
        stroke="#65AAD0"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function CSVDownloadDropdown({
  options,
  disabled,
  dropdownAlignment = 'right',
  hideFooter,
  hideDesktopNudge
}: {
  options: CSVDownloadOption[];
  disabled?: boolean;
  dropdownAlignment?: 'left' | 'center' | 'right';
  hideFooter?: boolean;
  hideDesktopNudge?: boolean;
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = isMobileDevice();
  const [estimateTask] = useEstimateTask();

  const handleDropdownClose = useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  const containerRef = useOutsideClick<HTMLDivElement>(handleDropdownClose);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const downloadCSV = useCallback(
    async (
      key: CSVDownloadOption['key'],
      fileName: CSVDownloadOption['fileName'],
      variables: CSVDownloadOption['variables'],
      filters?: CSVDownloadOption['filters'],
      totalSupply?: number
    ) => {
      estimateTask(key, fileName, variables, filters, totalSupply);
    },
    [estimateTask]
  );

  const showDesktopNudgeModal = !hideDesktopNudge && isMobile;

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <button
          title="Download CSV"
          className={classNames(
            'py-1.5 px-3 text-text-button bg-glass-1 rounded-full text-xs font-medium flex-row-center border border-solid border-transparent ',
            {
              'border-white': isDropdownVisible,
              'cursor-not-allowed pointer-events-none opacity-80': disabled
            }
          )}
          onClick={
            showDesktopNudgeModal ? handleModalOpen : handleDropdownToggle
          }
          disabled={disabled}
        >
          <CodeIconBlue />
        </button>
        {isDropdownVisible && (
          <div
            className={classNames(
              'bg-glass rounded-18 p-1 mt-1 flex flex-col absolute min-w-[214px] top-9 z-20',
              {
                'left-0': dropdownAlignment === 'left',
                'left-1/2 -translate-x-1/2': dropdownAlignment === 'center',
                'right-0': dropdownAlignment === 'right'
              }
            )}
            onClick={handleDropdownClose}
          >
            {options.map(
              ({ label, key, fileName, variables, filters, totalSupply }) => (
                <button
                  className="py-2 px-5 text-text-button rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap"
                  key={key}
                  onClick={() => {
                    downloadCSV(key, fileName, variables, filters, totalSupply);
                  }}
                >
                  {label}
                </button>
              )
            )}
            {!hideFooter && (
              <div className="pt-1 pb-3 px-5 text-[10px]">
                *CSV will contain the complete data. You can apply filters after
                the download.
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalVisible}
        hideDefaultContainer
        className="bg-transparent min-h-[400px] min-w-[400px] outline-none px-5"
        overlayClassName="bg-white bg-opacity-10 backdrop-blur-[50px] flex flex-col justify-center items-center fixed inset-0 z-[100]"
        onRequestClose={handleModalClose}
      >
        <div className="bg-primary backdrop-blur-[100px] p-5 border-solid-stroke rounded-xl text-center">
          <div className="text-base font-bold">
            Use desktop web to download CSV
          </div>
          <div className="text-sm text-text-secondary pt-1 pb-2">
            There is more on desktop. Fork code, SDKs, AI Assistant, and more!
          </div>
        </div>
      </Modal>
    </>
  );
}
