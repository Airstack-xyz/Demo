import { Modal } from "@/Components/Modal";
import { Tooltip, tooltipClass } from "@/Components/Tooltip";
import classNames from "classnames";
import { ReactNode, useState } from "react";
import { FrameIcon } from "./Icons";

export function FrameModal({ disabled, children }: { disabled?: boolean, children: ReactNode }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    const handleModalClose = () => {
      setIsModalVisible(false);
    };
  
    const handleModalOpen = () => {
      setIsModalVisible(true);
    };
  
    return (
      <>
        <Tooltip
          content="Share as Farcaster frame"
          contentClassName={tooltipClass}
          disabled={isModalVisible || disabled}
        >
          <button
            disabled={disabled}
            className={classNames(
              'py-1.5 px-3 text-text-button bg-glass-1 rounded-full flex-row-center border border-solid border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
              {
                'border-white': isModalVisible
              }
            )}
            onClick={handleModalOpen}
          >
            <FrameIcon />
          </button>
        </Tooltip>
        {isModalVisible && (
          <Modal
            isOpen
            className="w-full max-sm:min-w-full max-w-[686px] px-2.5 overflow-y-auto"
            containerClassName="!border-white max-sm:p-4"
            onRequestClose={handleModalClose}
          >
            {children}
          </Modal>
        )}
      </>
    );
  }