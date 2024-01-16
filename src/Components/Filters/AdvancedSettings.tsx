import { useCallback, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useSearchInput } from '../../hooks/useSearchInput';
import { ToggleSwitch } from '../ToggleSwitch';
import { FilterPlaceholder } from './FilterPlaceholder';

export function AdvancedSettings() {
  const [{ resolve6551 }, setData] = useSearchInput();

  const isResolve6551SwitchChecked = resolve6551 === '1';

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  const handleResolve6551Toggle = () => {
    setData(
      {
        resolve6551: isResolve6551SwitchChecked ? '0' : '1'
      },
      { updateQueryParams: true }
    );
    setIsDropdownVisible(false);
  };

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={dropdownContainerRef}
      >
        <FilterPlaceholder
          isOpen={isDropdownVisible}
          icon="settings-gray"
          iconSize={15}
          onClick={handleDropdownToggle}
        />
        {isDropdownVisible && (
          <div className="bg-glass rounded-18 p-3.5 mt-1 absolute min-w-[232px] left-0 top-full z-20">
            <div className="font-bold text-left whitespace-nowrap">
              Advanced settings
            </div>
            <div className="flex justify-between mt-4">
              <span className="font-bold">Resolve 6551 Owners</span>
              <ToggleSwitch
                checked={isResolve6551SwitchChecked}
                onClick={handleResolve6551Toggle}
              />
            </div>
            <div className="text-[10px] text-text-secondary mt-2">
              Some of the tokens could be held by 6551 Tokenbound accounts.
              Resolve them to the owner wallet addresses.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
