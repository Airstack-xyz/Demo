import { ReactNode, useRef, useCallback, useEffect, ElementRef } from 'react';
import classNames from 'classnames';

export type PopoverPositionType =
  | 'bottomRight'
  | 'bottomLeft'
  | 'topRight'
  | 'topLeft';

type PopoverProps = {
  anchor: ReactNode;
  children: ReactNode;
  openOnHover?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  closeOnOutsideClick?: boolean;
  className?: string;
  contentClass?: string;
  position?: PopoverPositionType; // default bottomLeft
  transformOrigin?: PopoverPositionType; // default topLeft
  contentWidthFull?: boolean; // make popover width same as anchor
};

export function Popover({
  children,
  anchor,
  isOpen,
  openOnHover,
  onClose,
  closeOnOutsideClick,
  className,
  contentClass
}: PopoverProps) {
  const ref = useRef<ElementRef<'div'>>(null);

  const handleOutsideClick = useCallback(
    ({ target }: MouseEvent) => {
      if (!ref.current?.contains(target as Node)) {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen && closeOnOutsideClick) {
      window.addEventListener('click', handleOutsideClick);
      return () => window.removeEventListener('click', handleOutsideClick);
    }
  }, [isOpen, closeOnOutsideClick, handleOutsideClick]);

  return (
    <div
      ref={ref}
      className={classNames('inline-block relative group', className, {
        ['openOnHover']: openOnHover,
        ['open']: isOpen
      })}
    >
      {anchor}
      <div
        className={classNames(
          'absolute z-50 opacity-0 pointer-events-none transition-all duration-200 delay-75 ease-out -translate-y-5 right-0',
          'group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0',
          contentClass
        )}
      >
        <div className="relative bg-tertiary rounded-md w-max">{children}</div>
      </div>
    </div>
  );
}
