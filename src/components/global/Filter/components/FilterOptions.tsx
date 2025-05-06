import { Button } from "~/components/ui/button";
import { useFilterContext } from "../context/filter.context";
import CommandSelect from "../../command-select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import {
  FILTER_V2_TEST_IDS,
  UNIQUE_BY_DEFAULT_DATA_TYPES,
} from "~/utils/filter.utils";
import type { IFilterColumn } from "~/types/filter.types";
import { ListFilter } from "lucide-react";
import FilterConditions from "./FilterConditions";

const FilterOptions = ({ variant = "text" }: { variant?: "icon" | "text" }) => {
  const {
    filters,
    filterMenuOpen,
    setFilterMenuOpen,
    resetCurrentFilter,
    currentStaleFilter,
    filterColumns,
    handleFilterTypeSelect,
  } = useFilterContext();

  const getAvailableFilterColumns = () => {
    if (!filterColumns) return [];

    return filterColumns.filter((column) => {
      // For UNIQUE_BY_DEFAULT_DATA_TYPES, treat isUnique as true if not explicitly set to false
      const isDefaultUniqueDataType =
        UNIQUE_BY_DEFAULT_DATA_TYPES.includes(column.dataType) &&
        column.isUnique !== false;

      // If the column should be treated as unique, check if it's already used in a filter
      if (column.isUnique || isDefaultUniqueDataType) {
        return !filters.some((filter) => filter.column.key === column.key);
      }
      // Non-unique columns are always available
      return true;
    });
  };

  return (
    <Popover
      open={filterMenuOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetCurrentFilter();
        }
        setFilterMenuOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-fit"
          data-testid={FILTER_V2_TEST_IDS.filterButton}
        >
          {variant === "icon" && <ListFilter className="w-4 h-4" />}
          {variant === "text" && (
            <>
              <ListFilter className="w-4 h-4" />
              Filter
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="!p-0 min-w-3xs"
        align="start"
        data-testid={FILTER_V2_TEST_IDS.filterOptionsPopoverContent}
      >
        {currentStaleFilter ? (
          <FilterConditions />
        ) : (
          <CommandSelect
            options={getAvailableFilterColumns()}
            labelKey="label"
            valueKey="key"
            placeholder="Filter by..."
            onSelect={(_, option) => handleFilterTypeSelect(option)}
            dataTestId={FILTER_V2_TEST_IDS.filterOptionsSelect}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FilterOptions;
