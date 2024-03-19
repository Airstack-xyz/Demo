import classNames from 'classnames';
import { ReactNode } from 'react';

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <circle
      cx="9"
      cy="9"
      r="8.4"
      transform="rotate(90 9 9)"
      stroke="white"
      stroke-width="1.2"
    />
    <path
      d="M8.72649 10.2218L9.00117 10.4965L9.27586 10.2218L11.5833 7.91437C11.6569 7.84077 11.7839 7.84077 11.8575 7.91437C11.9311 7.98797 11.9311 8.11494 11.8575 8.18854L9.13826 10.9078C9.09841 10.9476 9.05132 10.9649 9.00117 10.9649C8.95102 10.9649 8.90393 10.9476 8.86409 10.9078L6.14484 8.18854C6.07123 8.11494 6.07123 7.98797 6.14484 7.91437C6.21844 7.84077 6.34541 7.84077 6.41901 7.91437L8.72649 10.2218Z"
      fill="#8B8EA0"
      stroke="white"
      stroke-width="0.776928"
    />
  </svg>
);

function Accordion({
  isOpen,
  heading,
  children,
  className,
  onToggle
}: {
  isOpen: boolean;
  heading: ReactNode;
  children: ReactNode;
  className?: string;
  onToggle: () => void;
}) {
  return (
    <div
      className={classNames(
        'transition-all duration-500 rounded-18',
        className
      )}
    >
      <button onClick={onToggle} className="flex items-center cursor-pointer">
        <span
          className={classNames(
            'transform-gpu transition-transform duration-300',
            isOpen ? 'rotate-0' : '-rotate-90'
          )}
        >
          <ArrowIcon />
        </span>
        <div className="ml-2">{heading}</div>
      </button>
      <div
        className={classNames(
          'transition-all duration-500 overflow-hidden pt-2.5',
          isOpen ? 'opacity-1 max-h-[800px]' : 'max-h-0 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
