import classNames from 'classnames';

export function ToggleSwitch({
  label,
  checked,
  disabled,
  className,
  labelClassName,
  onClick
}: {
  label?: string;
  checked: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={classNames(
        'flex items-center disabled:hover:cursor-not-allowed disabled:opacity-50',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {label && (
        <div className={classNames('mr-2', labelClassName)}>{label}</div>
      )}
      <div
        className={classNames(
          'flex items-center h-[18px] w-[32px] rounded-18 transition-all',
          checked ? 'bg-text-button' : 'bg-[#303241]'
        )}
      >
        <div
          className={classNames(
            'flex-row-center relative h-[16px] w-[16px] bg-white rounded-full transition-all',
            checked ? 'left-[15px]' : 'left-[1px]'
          )}
        >
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            className={classNames(
              'transition-all',
              checked ? 'opacity-100' : 'opacity-0'
            )}
          >
            <path
              d="M2.7174 5.87604C2.58466 5.87604 2.46297 5.83179 2.36341 5.73223L0.162035 3.53085C-0.0370846 3.33173 -0.0370846 3.02199 0.162035 2.82287C0.361154 2.62375 0.670896 2.62375 0.870015 2.82287L2.72846 4.67026L7.14228 0.267504C7.3414 0.0683842 7.65114 0.0683842 7.85026 0.267504C8.04938 0.466623 8.04938 0.776365 7.85026 0.975484L3.08245 5.73223C2.97183 5.83179 2.85015 5.87604 2.7174 5.87604Z"
              fill="#65AAD0"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
