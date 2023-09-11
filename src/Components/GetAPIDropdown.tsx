import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { isMobileDevice } from '../utils/isMobileDevice';
import { Icon } from './Icon';
import { Modal } from './Modal';

type Options = {
  label: string;
  link: string;
};

export function GetAPIDropdown({
  options,
  disabled
}: {
  options: Options[];
  disabled?: boolean;
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

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={containerRef}
      >
        <button
          className={classNames(
            'py-2 px-4 text-text-button bg-secondary rounded-full text-xs font-medium flex-row-center border border-solid border-transparent',
            {
              'border-white': isDropdownVisible,
              'cursor-not-allowed pointer-events-none opacity-80': disabled
            }
          )}
          onClick={isMobile ? handleModalOpen : handleDropdownToggle}
          disabled={disabled}
        >
          <Icon name="tools" className="mr-1" height={16} width={16} />
          Get API
        </button>
        {isDropdownVisible && (
          <div
            className="bg-glass rounded-18 p-1 mt-1 flex flex-col absolute min-w-[214px] top-9 z-20"
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
            <div className="pt-1 pb-3 px-5 text-[10px]">
              *APIs will reflect the applied filters
            </div>
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
