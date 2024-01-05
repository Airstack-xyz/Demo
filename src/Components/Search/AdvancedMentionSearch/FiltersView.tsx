import classNames from 'classnames';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FilterOption } from '../../Filters/FilterOption';
import { Icon } from '../../Icon';
import { ChainSelectOption, chainOptions } from './ChainFilter';
import { TokenSelectOption, tokenOptions } from './TokenFilter';
import { FilterButtonDataType } from './types';

export function FiltersButtonPortal({
  containerRef,
  RenderButton,
  appliedFilterCount,
  isOpen,
  onClick
}: {
  containerRef: FilterButtonDataType['containerRef'];
  RenderButton: FilterButtonDataType['RenderButton'];
  appliedFilterCount: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  if (!containerRef?.current) {
    return null;
  }
  const component = RenderButton ? (
    RenderButton({ appliedFilterCount, isOpen, onClick })
  ) : (
    <button
      className={classNames(
        'py-1.5 px-3 rounded-full bg-glass-1 text-text-secondary border border-solid border-transparent text-xs hover:bg-glass-1-light flex-row-center',
        { 'border-white': isOpen }
      )}
      onClick={onClick}
    >
      {appliedFilterCount > 0 ? (
        <>
          <span>{`Filters (${appliedFilterCount})`}</span>
        </>
      ) : (
        <>
          <span>Filters</span>
          <Icon name="arrow-down" height={18} width={18} className="ml-0.5" />
        </>
      )}
    </button>
  );
  return createPortal(component, containerRef.current);
}

type FiltersViewProps = {
  selectedToken: TokenSelectOption;
  selectedChain: ChainSelectOption;
  onTokenSelect: (option: TokenSelectOption) => void;
  onChainSelect: (option: ChainSelectOption) => void;
  onClose: () => void;
};

const sectionHeaderClass =
  'font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap';

export default function FiltersView({
  onClose,
  selectedToken,
  selectedChain,
  onTokenSelect,
  onChainSelect
}: FiltersViewProps) {
  const [currentTokenOption, setCurrentTokenOption] = useState(selectedToken);
  const [currentChainOption, setCurrentChainOption] = useState(selectedChain);

  const handleApplyClick = () => {
    onTokenSelect(currentTokenOption);
    onChainSelect(currentChainOption);
    onClose();
  };

  const renderTokenSection = () => {
    return (
      <>
        <div className={classNames(sectionHeaderClass)}>Token type</div>
        {tokenOptions.map(item => (
          <FilterOption
            key={item.value}
            label={item.label}
            isSelected={currentTokenOption.value === item.value}
            onClick={() => setCurrentTokenOption(item)}
          />
        ))}
      </>
    );
  };

  const renderChainSection = () => {
    return (
      <>
        <div className={classNames(sectionHeaderClass)}>Blockchain</div>
        {chainOptions.map(item => (
          <FilterOption
            key={item.value}
            label={item.label}
            isSelected={currentChainOption.value === item.value}
            onClick={() => setCurrentChainOption(item)}
          />
        ))}
      </>
    );
  };

  return (
    <div className="text-xs">
      {renderTokenSection()}
      {renderChainSection()}
      <div className="mt-4 mb-3 ml-3 flex items-center gap-2">
        <button
          type="button"
          className="px-2.5 py-1 rounded-full bg-white backdrop-blur-[66.63px] text-primary hover:opacity-60"
          onClick={handleApplyClick}
        >
          Apply
        </button>
        <button
          type="button"
          className="px-2.5 py-1 rounded-full hover:opacity-60"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
