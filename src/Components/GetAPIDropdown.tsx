import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { isMobileDevice } from '../utils/isMobileDevice';
import { Modal } from './Modal';

type Options = {
  label: string;
  link: string;
};

function CodeIconBlue() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
    >
      <path
        d="M9.79132 0.990628C9.87524 0.571358 9.60334 0.163496 9.18404 0.0796354C8.76474 -0.00421433 8.3569 0.267691 8.27308 0.68696L9.79132 0.990628ZM6.20858 11.0095C6.12466 11.4288 6.39655 11.8366 6.81585 11.9204C7.23515 12.0043 7.64299 11.7325 7.72681 11.3131L6.20858 11.0095ZM3.32738 9.60477C3.63184 9.90495 4.12202 9.90144 4.42223 9.59703C4.72242 9.29252 4.71897 8.8024 4.4145 8.50212L3.32738 9.60477ZM0.774188 6.00005L0.230626 5.44872C0.0830757 5.59427 0 5.79288 0 6.00005C0 6.20722 0.0830757 6.40583 0.230626 6.55137L0.774188 6.00005ZM4.4145 3.49794C4.71897 3.19773 4.72242 2.70755 4.42223 2.40309C4.12202 2.09863 3.63184 2.09517 3.32738 2.39537L4.4145 3.49794ZM11.5894 8.45495C11.2827 8.75296 11.2758 9.24307 11.5738 9.54965C11.8718 9.85633 12.3619 9.86325 12.6685 9.56524L11.5894 8.45495ZM15.2257 6.00005L15.7653 6.55519C15.9139 6.41078 15.9984 6.2128 15.9999 6.00552C16.0013 5.79835 15.9197 5.59912 15.7731 5.45265L15.2257 6.00005ZM12.6764 2.35586C12.374 2.05353 11.8839 2.05353 11.5815 2.35586C11.2792 2.6582 11.2792 3.14839 11.5815 3.45073L12.6764 2.35586ZM8.27308 0.68696L6.20858 11.0095L7.72681 11.3131L9.79132 0.990628L8.27308 0.68696ZM4.4145 8.50212L1.31775 5.44872L0.230626 6.55137L3.32738 9.60477L4.4145 8.50212ZM1.31775 6.55137L4.4145 3.49794L3.32738 2.39537L0.230626 5.44872L1.31775 6.55137ZM12.6685 9.56524L15.7653 6.55519L14.6861 5.44491L11.5894 8.45495L12.6685 9.56524ZM15.7731 5.45265L12.6764 2.35586L11.5815 3.45073L14.6783 6.54745L15.7731 5.45265Z"
        fill="#65AAD0"
      />
    </svg>
  );
}

export function GetAPIDropdown({
  options,
  disabled,
  dropdownAlignment = 'left',
  hideFooter,
  hideDesktopNudge
}: {
  options: Options[];
  disabled?: boolean;
  dropdownAlignment?: 'left' | 'center' | 'right';
  hideFooter?: boolean;
  hideDesktopNudge?: boolean;
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = isMobileDevice();

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

  const showDesktopNudgeModal = !hideDesktopNudge && isMobile;

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <button
          className={classNames(
            'py-1.5 px-3 text-text-button bg-glass-1 rounded-full text-xs font-medium flex-row-center border border-solid border-transparent',
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
          <span className="mr-1.5">
            <CodeIconBlue />
          </span>
          Get API
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
            {options.map(({ label, link }) => (
              <a
                className="py-2 px-5 text-text-button rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap"
                target="_blank"
                href={link}
                key={label}
              >
                {label}
              </a>
            ))}
            {!hideFooter && (
              <div className="pt-1 pb-3 px-5 text-[10px]">
                *APIs will reflect the applied filters
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
            Use desktop web to get all the APIs
          </div>
          <div className="text-sm text-text-secondary pt-1 pb-2">
            There is more on desktop. Fork code, SDKs, AI Assistant, and more!
          </div>
        </div>
      </Modal>
    </>
  );
}
