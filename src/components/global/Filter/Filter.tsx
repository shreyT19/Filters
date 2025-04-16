//TODOS: Left for future reference
//! - [ ] Extend custom filter to include other types like date, async_select, enum object  - Cancelled (There is no so such custom case for this case, building out the parser and ui for this case is not worth it at the moment)
// ! - [ ] Fix generic types in filter.types.ts, currently it is a bit messed:
// - [ ] Save Filter as Presets or Views - Later
"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { IFilter, IFilterColumn } from "~/types/filter.types";
import { FilterContext } from "./context/filter.context";
import { cn } from "~/lib/utils";
import FilterOptions from "./components/FilterOptions";
import FilterTags from "./components/FilterTags/FilterTags";
interface IFilterSystemProps<T> {
  filters?: IFilter<T>[];
  onFiltersChange?: React.Dispatch<React.SetStateAction<IFilter<T>[]>>;
  filterColumns: IFilterColumn<T>[];
  onApply?: (filterQuery: string, activeFilters: IFilter<T>[]) => void;
  className?: string;
}

export default function TableFilterV2<T>({
  filters = [],
  filterColumns,
  onApply,
  onFiltersChange,
  className,
}: IFilterSystemProps<T>) {
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [filterOptionsOpen, setFilterOptionsOpen] = useState<boolean>(false);
  const [filterValuesOpen, setFilterValuesOpen] = useState<boolean>(false);

  const [currentStaleFilter, setCurrentStaleFilter] =
    useState<IFilter<T> | null>(null);

  //   /**
  //    * Close the filter menu when the escape key is pressed
  //    */
  //   useKeyboardShortcut("Escape", () => closeAndResetFilter());

  //   /**
  //    * Open the filter menu when the F key is pressed
  //    */
  //   useKeyboardShortcut("F", () => setFilterMenuOpen(true));
  /**
   * Remove a filter by id
   */
  const removeFilter = (id: string) => {
    const updatedFilters = filters?.filter((f) => f?.id !== id);
    onFiltersChange?.(updatedFilters);
    applyFilters(updatedFilters);
    resetCurrentFilter();
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    onFiltersChange?.([]);
    applyFilters([]);
    resetCurrentFilter();
  };

  /**
   * Handle filter type selection
   */
  const handleFilterTypeSelect = (option: IFilterColumn<T>) => {
    setCurrentStaleFilter({
      id: crypto.randomUUID(),
      column: option,
      dataType: option.dataType,
    });
  };

  /**
   * Add or update a filter
   */
  const addOrUpdateFilter = (filter: IFilter<T>) => {
    let updatedFilters: IFilter<T>[] = [];

    //  add or update existing filter
    const existingFilter = filters?.find((f) => f?.id === filter?.id);
    if (existingFilter) {
      updatedFilters = filters?.map((f) => (f?.id === filter?.id ? filter : f));
    } else {
      updatedFilters = [...(filters || []), filter];
    }

    onFiltersChange?.(updatedFilters);
    // applyFilters(updatedFilters);
  };

  /**
   * Reset the current stale filter
   */
  const resetCurrentFilter = () => {
    setCurrentStaleFilter(null);
  };

  /**
   * Close and reset the filter menu
   */
  const closeAndResetFilter = async () => {
    setFilterMenuOpen(false);
    setFilterOptionsOpen(false);
    setFilterValuesOpen(false);
    // Not ideal, but for better user experience
    setTimeout(() => {
      resetCurrentFilter();
    }, 100);
  };

  const applyFilters = (filtersToApply = filters) => {
    // const [_activeFilters, query] = buildQueryFromFiltersV2(filtersToApply);
    // onApply?.(query, _activeFilters);
  };

  console.log(filters);

  return (
    <>
      <FilterContext.Provider
        value={{
          filters,
          setFilters: onFiltersChange || (() => {}),
          filterColumns,
          removeFilter,
          clearFilters,
          addOrUpdateFilter,
          closeAndResetFilter,
          currentStaleFilter,
          setCurrentStaleFilter,
          filterMenuOpen,
          setFilterMenuOpen,
          filterOptionsOpen,
          setFilterOptionsOpen,
          filterValuesOpen,
          setFilterValuesOpen,
          resetCurrentFilter,
          handleFilterTypeSelect: (option: IFilterColumn<any>) =>
            handleFilterTypeSelect(option as IFilterColumn<T>),
        }}
      >
        <div
          className={cn(
            "w-full flex flex-col gap-4",
            filterMenuOpen && "pb-4",
            className
          )}
        >
          {filters.length === 0 && <FilterOptions variant="text" />}
          {filters.length > 0 && (
            <div
              className="flex flex-col gap-2"
              //   data-testid={FILTER_V2_TEST_IDS.activeFiltersContainer}
            >
              <div className="flex items-start justify-between">
                <FilterTags />
                <div className="flex items-center gap-2">
                  <Button
                    className="w-fit px-3 rounded-lg hover:!text-red-500 hover:!border-red-500 hover:!bg-red-50 transition-all duration-200"
                    variant="secondary"
                    size="sm"
                    onClick={clearFilters}
                    // data-testid={FILTER_V2_TEST_IDS.clearFiltersButton}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </FilterContext.Provider>
    </>
  );
}
