import { createContext, useContext } from "react";
import type { IFilterColumn, IFilter } from "~/types/filter.types";

interface IFilterContext<T> {
  filters: IFilter<T>[];
  setFilters: React.Dispatch<React.SetStateAction<IFilter<T>[]>>;
  filterColumns: IFilterColumn<T>[] | null;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  addOrUpdateFilter: (filter: IFilter<T>) => void;
  closeAndResetFilter: () => void;
  currentStaleFilter: IFilter<T> | null;
  setCurrentStaleFilter: React.Dispatch<
    React.SetStateAction<IFilter<T> | null>
  >;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  filterOptionsOpen: boolean;
  setFilterOptionsOpen: (open: boolean) => void;
  filterValuesOpen: boolean;
  setFilterValuesOpen: (open: boolean) => void;
  resetCurrentFilter: () => void;
  handleFilterTypeSelect: (option: IFilterColumn<T>) => void;
}

export const FilterContext = createContext<IFilterContext<any> | null>(null);

export const useFilterContext = <T>() => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      "Filters.* must be rendered as a child of FilterContext component"
    );
  }

  return {
    ...context,
  };
};
