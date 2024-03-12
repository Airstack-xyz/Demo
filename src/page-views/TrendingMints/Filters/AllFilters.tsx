import { Option } from '@/Components/Dropdown';
import { FilterOption } from '@/Components/Filters/FilterOption';
import { filterPlaceholderClass } from '@/Components/Filters/FilterPlaceholder';
import { Icon } from '@/Components/Icon';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { CachedQuery, useSearchInput } from '@/hooks/useSearchInput';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { audienceOptions, defaultAudienceFilter } from './AudienceFilter';
import { blockchainOptions, defaultBlockchainFilter } from './BlockchainFilter';
import { criteriaOptions, defaultCriteriaFilter } from './CriteriaFilter';
import { defaultTimeFrameFilter, timeFrameOptions } from './TimeFrameFilter';

const sectionHeaderClass =
  'font-bold py-2 px-3.5 rounded-full text-left whitespace-nowrap';

export function AllFilters() {
  const [searchInputs, setData] = useSearchInput();

  const timeFrame = searchInputs.timeFrame || defaultTimeFrameFilter;
  const blockchain = searchInputs.blockchain || defaultBlockchainFilter;
  const audience = searchInputs.audience || defaultAudienceFilter;
  const criteria = searchInputs.criteria || defaultCriteriaFilter;

  const [currentTimeFrame, setCurrentTimeFrame] = useState(timeFrame);
  const [currentBlockchain, setCurrentBlockchain] = useState(blockchain);
  const [currentAudience, setCurrentAudience] = useState(audience);
  const [currentCriteria, setCurrentCriteria] = useState(criteria);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownHide = useCallback(() => {
    setIsDropdownVisible(false);
    setCurrentTimeFrame(timeFrame);
    setCurrentBlockchain(blockchain);
    setCurrentAudience(audience);
    setCurrentCriteria(criteria);
  }, [timeFrame, blockchain, audience, criteria]);

  const dropdownContainerRef =
    useOutsideClick<HTMLDivElement>(handleDropdownHide);

  useEffect(() => {
    setIsDropdownVisible(false);
    setCurrentTimeFrame(timeFrame);
    setCurrentBlockchain(blockchain);
    setCurrentAudience(audience);
    setCurrentCriteria(criteria);
  }, [audience, blockchain, criteria, timeFrame]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownVisible(prevValue => !prevValue);
  }, []);

  // Not enclosing in useCallback as its dependencies will change every time
  const handleApplyClick = () => {
    const filterValues: Partial<CachedQuery> = {
      timeFrame: currentTimeFrame,
      blockchain: currentBlockchain,
      audience: currentAudience,
      criteria: currentCriteria
    };

    setIsDropdownVisible(false);
    setData(filterValues, { updateQueryParams: true });
  };

  const renderFilterSection = ({
    header,
    options,
    selectedValue,
    onClick
  }: {
    header: string;
    options: Option[];
    selectedValue: string;
    onClick: (value: string) => void;
  }) => {
    return (
      <>
        <div className={sectionHeaderClass}>{header}</div>
        {options.map(item => (
          <FilterOption
            key={item.value}
            label={item.label}
            isSelected={selectedValue === item.value}
            onClick={() => onClick(item.value)}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <div
        className="text-xs font-medium relative flex flex-col items-end"
        ref={dropdownContainerRef}
      >
        <button
          className={classNames(filterPlaceholderClass, {
            'border-white': isDropdownVisible
          })}
          onClick={handleDropdownToggle}
        >
          Filters
          <Icon name="arrow-down" height={16} width={16} className="ml-1" />
        </button>
        {isDropdownVisible && (
          <div className="before-bg-glass before:z-[-1] before:rounded-18 p-1 mt-1 flex flex-col absolute min-w-[202px] left-0 top-full z-20">
            {renderFilterSection({
              header: 'Time frame',
              options: timeFrameOptions,
              selectedValue: currentTimeFrame,
              onClick: value => setCurrentTimeFrame(value)
            })}
            {renderFilterSection({
              header: 'Blockchain',
              options: blockchainOptions,
              selectedValue: currentBlockchain,
              onClick: value => setCurrentBlockchain(value)
            })}
            {renderFilterSection({
              header: 'Audience',
              options: audienceOptions,
              selectedValue: currentAudience,
              onClick: value => setCurrentAudience(value)
            })}
            {renderFilterSection({
              header: 'Criteria',
              options: criteriaOptions,
              selectedValue: currentCriteria,
              onClick: value => setCurrentCriteria(value)
            })}
            <div className="p-2 mt-1 flex justify-center gap-5">
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
                onClick={handleDropdownHide}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
