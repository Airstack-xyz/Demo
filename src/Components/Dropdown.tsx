import { ReactNode, useCallback, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

export type Option = {
  label: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;

export function Dropdown({
  options,
  selected,
  closeOnSelect = false,
  renderOption,
  renderPlaceholder,
  onChange,
  disabled,
  heading,
  footerComponent
}: {
  options: Option[];
  selected?: Option[];
  closeOnSelect?: boolean;
  renderPlaceholder: (
    option: Option[],
    isOpen: boolean,
    isDisabled?: boolean
  ) => ReactNode;
  renderOption: (params: {
    option: Option;
    selected: Option[];
    isSelected: boolean;
    setSelected: (selected: Option[]) => void;
  }) => ReactNode;
  onChange: (selected: Option[]) => void;
  disabled?: boolean;
  heading?: string;
  footerComponent?: ReactNode;
}) {
  const [_selected, setSelected] = useState<Option[]>([]);
  const [show, setShow] = useState(false);

  const containerRef = useOutsideClick<HTMLDivElement>(() => setShow(false));

  const handleSelection = useCallback(
    (newSelection: Option[]) => {
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
        {renderPlaceholder(actualSelected, show, disabled)}
      </div>
      {show && (
        <div
          className="bg-glass rounded-18 p-1 mt-1 flex flex-col absolute z-20 min-w-[110%] left-0 top-full"
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
