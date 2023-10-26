import { ReactNode, useCallback, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';
import classnames from 'classnames';

export type Option = {
  label: string;
  value: string;
};

export function Dropdown<T extends Option = Option>({
  options,
  selected,
  closeOnSelect = false,
  renderOption,
  renderPlaceholder,
  onChange,
  disabled,
  heading,
  footerComponent,
  optionsContainerClassName
}: {
  options: T[];
  selected?: T[];
  closeOnSelect?: boolean;
  optionsContainerClassName?: string;
  renderPlaceholder: (option: T[], isOpen: boolean) => ReactNode;
  renderOption: (params: {
    option: T;
    selected: T[];
    isSelected: boolean;
    setSelected: (selected: T[]) => void;
  }) => ReactNode;
  onChange: (selected: T[]) => void;
  disabled?: boolean;
  heading?: string;
  footerComponent?: ReactNode;
}) {
  const [_selected, setSelected] = useState<T[]>([]);
  const [show, setShow] = useState(false);

  const containerRef = useOutsideClick<HTMLDivElement>(() => setShow(false));

  const handleSelection = useCallback(
    (newSelection: T[]) => {
      if (selected === undefined) {
        setSelected(newSelection);
      }
      onChange(newSelection);
      if (closeOnSelect) {
        setShow(false);
      }
    },
    [closeOnSelect, onChange, selected]
  );

  const actualSelected = selected || _selected;

  return (
    <div
      className="text-xs font-medium relative inline-flex flex-col items-center"
      ref={containerRef}
    >
      <div onClick={() => setShow(show => (disabled ? false : !show))}>
        {renderPlaceholder(actualSelected, show)}
      </div>
      {show && (
        <div
          className={classnames(
            'bg-glass rounded-18 p-1 mt-1 flex flex-col absolute z-20 min-w-[110%] left-0 top-full',
            optionsContainerClassName
          )}
          onClick={() => setShow(false)}
        >
          {!!heading && (
            <div className="font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap">
              {heading}
            </div>
          )}
          {options.map((option, index) => (
            <div key={index}>
              {renderOption({
                option,
                selected: actualSelected,
                setSelected: handleSelection,
                isSelected:
                  actualSelected.findIndex(
                    item => item.value === option.value
                  ) !== -1
              })}
            </div>
          ))}
          {footerComponent}
        </div>
      )}
    </div>
  );
}
