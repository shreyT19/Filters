import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { useFilterContext } from "../../context/filter.context";
import { IFilter } from "~/types/filter.types";
import FilterValuesForAsyncList from "./components/filter-values-async-list";
import FilterValuesForBoolean from "./components/filter-values-boolean";
import FilterValuesForDate from "./components/filter-values-date";

interface FilterValueSelectorProps {
  filter: IFilter;
  isOpen: boolean;
  onOpenChange: (id: string, open: boolean) => void;
}

const FilterValueSelectorInTags = ({
  filter,
  isOpen,
  onOpenChange,
}: FilterValueSelectorProps) => {
  const { setCurrentStaleFilter } = useFilterContext();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => onOpenChange(filter?.id!, open)}
    >
      <PopoverTrigger asChild>
        <span
          className={`flex items-center text-primary-page-heading font-semibold hover:bg-slate-100 bg-slate-100 hover:cursor-pointer text-xs px-1.5 py-1 rounded ${
            isOpen ? "bg-slate-100" : ""
          }`}
          onClick={() => {
            onOpenChange(filter?.id!, true);
            setCurrentStaleFilter(filter);
          }}
        >
          {filter.subDataType === "async_list" ||
          filter.subDataType === "enum" ||
          filter.subDataType === "object" ||
          filter.dataType === "enum" ||
          filter.dataType === "object" ||
          filter.dataType === "async_list" ? (
            <FilterValuesForAsyncList filter={filter} />
          ) : filter.subDataType === "boolean" ||
            filter.dataType === "boolean" ? (
            <FilterValuesForBoolean filter={filter} />
          ) : filter.subDataType === "date" || filter.dataType === "date" ? (
            <FilterValuesForDate filter={filter} />
          ) : (
            <>{filter.selectedValue?.value}</>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="!p-0 min-w-3xs" align="start">
        {/* Content goes here */}
      </PopoverContent>
    </Popover>
  );
};

export default FilterValueSelectorInTags;
