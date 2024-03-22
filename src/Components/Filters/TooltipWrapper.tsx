import classNames from 'classnames';
import React, { ReactNode, useCallback, useRef } from 'react';

export function TooltipWrapper({
  tooltipEnabled,
  tooltipText,
  tooltipIconHidden,
  tooltipTopOffset = -5,
  tooltipLeftOffset = 15,
  children,
  className
}: {
  tooltipEnabled?: boolean;
  tooltipText?: string;
  tooltipIconHidden?: boolean;
  tooltipTopOffset?: number;
  tooltipLeftOffset?: number;
  children?: ReactNode;
  className?: string;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTooltipShow = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'flex';
    }
  }, []);

  const handleTooltipHide = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  }, []);

  const handleTooltipMove = useCallback(
    (event: React.MouseEvent) => {
      if (tooltipRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const left = event.clientX - rect.left + tooltipLeftOffset;
        const top = event.clientY - rect.top + tooltipTopOffset;
        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.top = `${top}px`;
      }
    },
    [tooltipLeftOffset, tooltipTopOffset]
  );

  return (
    <div
      ref={containerRef}
      className={classNames('relative', className)}
      onMouseEnter={tooltipEnabled ? handleTooltipShow : undefined}
      onMouseLeave={tooltipEnabled ? handleTooltipHide : undefined}
      onMouseMove={tooltipEnabled ? handleTooltipMove : undefined}
    >
      {children}
      {tooltipEnabled ? (
        <div
          ref={tooltipRef}
          className="absolute hidden dropdown-bg rounded-[16px] py-1.5 px-3 w-max text-xs text-text-secondary z-[50]"
        >
          {!tooltipIconHidden && (
            <svg
              fill="#97999c"
              viewBox="0 0 32 32"
              className="mr-1"
              width={16}
              height={16}
            >
              <path d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.776 2.24-6.912l16.704 16.704q-3.168 2.208-6.944 2.208-3.264 0-6.016-1.6t-4.384-4.352-1.6-6.048zM9.056 6.24q3.168-2.24 6.944-2.24 3.264 0 6.016 1.632t4.384 4.352 1.6 6.016q0 3.808-2.24 6.944z" />
            </svg>
          )}
          {tooltipText}
        </div>
      ) : null}
    </div>
  );
}
