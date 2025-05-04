import FilterPopover from "../FilterOptions";
import { useState } from "react";
import type { IFilter } from "~/types/filter.types";
import { FILTER_V2_TEST_IDS } from "~/utils/filter.utils";
import { CircleX } from "lucide-react";
import { useFilterContext } from "../../context/filter.context";
import FilterConditionSelectorInTags from "./filter-condition-selector";
import FilterValueSelectorInTags from "./filter-value-selector";

const FilterTag = ({
  filter,
  index,
  isPopoverOpen,
  onPopoverOpenChangeForFilterValue,
  isFilterConditionPopoverOpen,
  onFilterConditionPopoverOpenChange,
}: {
  filter: IFilter;
  index: number;
  isPopoverOpen: boolean;
  onPopoverOpenChangeForFilterValue: (id: string, open: boolean) => void;
  isFilterConditionPopoverOpen: boolean;
  onFilterConditionPopoverOpenChange: (id: string, open: boolean) => void;
}) => {
  const { removeFilter } = useFilterContext();

  return (
    <div
      className="flex flex-col gap-2 border border-gray-2000 rounded-lg px-2.5 py-1.5 shadow-light animate-fade-right animate-delay-150 animate-duration-300"
      data-testid={`${FILTER_V2_TEST_IDS.filterTag}-${index}`}
    >
      <div className="flex items-center gap-2 text-primary-page-heading font-medium text-xs leading-3">
        {/* Filter Tag Header */}
        <div className="flex items-center gap-1">
          {/* {getIconForKeyword(filter?.column?.icon as IconType)} */}
          {filter?.column?.label}
        </div>
        <div className="border-r border-gray-2000 !h-4" />
        {/* Filter Condition */}
        <FilterConditionSelectorInTags
          filter={filter}
          index={index}
          isOpen={isFilterConditionPopoverOpen}
          onOpenChange={onFilterConditionPopoverOpenChange}
        />
        <div className="border-r border-gray-2000 !h-4" />
        {/* Filter Value Selector */}
        <div className="text-gray-400 text-xs">
          {filter?.selectedValue?.value}
        </div>
        <FilterValueSelectorInTags
          filter={filter}
          isOpen={isPopoverOpen}
          onOpenChange={onPopoverOpenChangeForFilterValue}
        />

        <div className="border-r border-gray-2000 !h-4" />
        {/* Remove Filter Button */}
        <div
          title="Remove Filter"
          onClick={() => removeFilter(filter?.id!)}
          data-testid={`${FILTER_V2_TEST_IDS.filterTagRemoveButton}-${index}`}
        >
          <CircleX className="text-gray-400 h-4 w-4 hover:text-gray-600 transition-all duration-200 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

const FilterTags = () => {
  const {
    filters,
    setCurrentStaleFilter,
    filterValuesOpen,
    setFilterValuesOpen,
    resetCurrentFilter,
    filterOptionsOpen,
    setFilterOptionsOpen,
  } = useFilterContext();

  const [clickedPopoverId, setClickedPopoverId] = useState<string | null>(null);

  const handlePopoverOpenChangeForFilterValue = (id: string, open: boolean) => {
    setClickedPopoverId(open ? id : null);
    setFilterValuesOpen(open);
    setCurrentStaleFilter(filters?.find((filter) => filter?.id === id) || null);

    if (!open) {
      resetCurrentFilter();
    }
  };

  const handlePopoverOpenChangeForFilterCondition = (
    id: string,
    open: boolean
  ) => {
    setClickedPopoverId(open ? id : null);
    setFilterOptionsOpen(open);
    setCurrentStaleFilter(filters?.find((filter) => filter?.id === id) || null);
    if (!open) {
      resetCurrentFilter();
    }
  };

  return (
    <div
      className="flex gap-2 items-center flex-wrap flex-1"
      data-testid={FILTER_V2_TEST_IDS.filterTags}
    >
      {filters?.map((filter, index) => (
        <FilterTag
          key={index}
          filter={filter}
          index={index}
          isPopoverOpen={clickedPopoverId === filter?.id && filterValuesOpen}
          onPopoverOpenChangeForFilterValue={
            handlePopoverOpenChangeForFilterValue
          }
          isFilterConditionPopoverOpen={
            clickedPopoverId === filter?.id && filterOptionsOpen
          }
          onFilterConditionPopoverOpenChange={
            handlePopoverOpenChangeForFilterCondition
          }
        />
      ))}
      <FilterPopover variant="icon" />
    </div>
  );
};

export default FilterTags;
