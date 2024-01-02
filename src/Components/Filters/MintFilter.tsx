/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import { useSearchInput } from '../../hooks/useSearchInput';
import { ToggleSwitch } from '../ToggleSwitch';
import { TooltipWrapper } from './TooltipWrapper';

export type MintFilterType = '1' | '0';

export const defaultMintFilter = '0';

export function MintFilter({
  disabled,
  disabledTooltipText
}: {
  disabled?: boolean;
  disabledTooltipText?: string;
}) {
  const [{ mintFilter }, setData] = useSearchInput();

  const isSwitchChecked = mintFilter === '1';

  const enableTooltip = disabled && Boolean(disabledTooltipText);

  const handleToggle = () => {
    setData(
      {
        mintFilter: isSwitchChecked ? '0' : '1'
      },
      { updateQueryParams: true }
    );
  };

  return (
    <TooltipWrapper
      tooltipEnabled={enableTooltip}
      tooltipText={disabledTooltipText}
    >
      <ToggleSwitch
        label="Mints only"
        labelClassName="text-xs font-medium text-text-secondary"
        checked={isSwitchChecked}
        disabled={disabled}
        className={classNames({
          'disabled:cursor-auto': enableTooltip // for not showing disabled cursor for tooltip
        })}
        onClick={handleToggle}
      />
    </TooltipWrapper>
  );
}
