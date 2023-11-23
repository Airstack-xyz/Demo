/* eslint-disable react-refresh/only-export-components */
import { useSearchInput } from '../../hooks/useSearchInput';
import { ToggleSwitch } from '../ToggleSwitch';

export type SpamFilterType = '1' | '0';

export const defaultSpamFilter = '1';

export function SpamFilter({ disabled }: { disabled?: boolean }) {
  const [{ spamFilter }, setData] = useSearchInput();

  const isSwitchChecked = spamFilter !== '0';

  const handleToggle = () => {
    setData(
      {
        spamFilter: isSwitchChecked ? '0' : '1'
      },
      { updateQueryParams: true }
    );
  };

  return (
    <ToggleSwitch
      label="Filter Spam"
      labelClassName="text-xs font-medium text-text-secondary"
      checked={isSwitchChecked}
      disabled={disabled}
      onClick={handleToggle}
    />
  );
}
