import { useState } from "react";
import { startCase } from "lodash";
import {
  EFilterObjectCondition,
  IFilterColumnAsyncList,
  IFilterColumnObject,
  IFilterColumnEnum,
  // ILoadOptionsItemType,
} from "~/types/filter.types";

import MultiSelectCommand from "~/components/global/multi-select";
import ApplyFilterButton from "../../ApplyFilterButton";
import { useFilterContext } from "../../../context/filter.context";

const MultiSelect = () => {
  const { currentStaleFilter, addOrUpdateFilter, closeAndResetFilter } =
    useFilterContext();

  // Handle different types of data sources
  const getOptions = () => {
    if (currentStaleFilter?.column.dataType === "async_list") {
      const asyncListType = currentStaleFilter.column as IFilterColumnAsyncList;
      // return serviceKeyIds()[asyncListType.valueProps.loadOptionsOf].load;
    }

    if (currentStaleFilter?.column.dataType === "object") {
      const objectType = currentStaleFilter.column as IFilterColumnObject;
      return async (query: string) => objectType.valueProps.options;
    }

    if (currentStaleFilter?.column.dataType === "enum") {
      const enumType = currentStaleFilter.column as IFilterColumnEnum;
      // Convert enum strings to object format
      return async (query: string) =>
        enumType.valueProps.options.map((option) => ({
          [getLabelKey()]: startCase(option),
          [getValueKey()]: option,
        }));
    }

    return async (query: string) => [];
  };

  const getLabelKey = () => {
    if (currentStaleFilter?.column.dataType === "async_list") {
      return (currentStaleFilter.column as IFilterColumnAsyncList).valueProps
        .labelKey;
    }
    if (currentStaleFilter?.column.dataType === "object") {
      return (currentStaleFilter.column as IFilterColumnObject).valueProps
        .labelKey as string;
    }
    return "label";
  };

  const getValueKey = () => {
    if (currentStaleFilter?.column.dataType === "async_list") {
      return (currentStaleFilter.column as IFilterColumnAsyncList).valueProps
        .valueKey;
    }
    if (currentStaleFilter?.column.dataType === "object") {
      return (currentStaleFilter.column as IFilterColumnObject).valueProps
        .valueKey as string;
    }
    return "value";
  };

  const [selectedValues, setSelectedValues] = useState<string[]>(
    currentStaleFilter?.selectedValue?.value as string[]
  );
  const [selectedOptions, setSelectedOptions] = useState<
    // ILoadOptionsItemType[] | undefined
    any[] | undefined
  >(
    currentStaleFilter?.selectedValue?.metaData as undefined // | ILoadOptionsItemType[]
  );

  const handleApplyFilter = () => {
    let selectedCondition =
      currentStaleFilter?.selectedCondition || EFilterObjectCondition.IS;
    if (selectedValues?.length > 1) {
      // If current condition is negative, keep it negative
      if (
        selectedCondition === EFilterObjectCondition.IS_NOT ||
        selectedCondition === EFilterObjectCondition.IS_NOT_ANY_OF
      ) {
        selectedCondition = EFilterObjectCondition.IS_NOT_ANY_OF;
      } else {
        selectedCondition = EFilterObjectCondition.IS_ANY_OF;
      }
    } else if (selectedValues?.length === 1) {
      // If current condition is negative, keep it negative

      if (
        selectedCondition === EFilterObjectCondition.IS_NOT_ANY_OF ||
        selectedCondition === EFilterObjectCondition.IS_NOT
      ) {
        selectedCondition = EFilterObjectCondition.IS_NOT;
      } else {
        selectedCondition = EFilterObjectCondition.IS;
      }
    }

    addOrUpdateFilter({
      ...currentStaleFilter!,
      selectedCondition,
      selectedValue: {
        value: selectedValues,
        metaData: selectedOptions as any,
      },
    });
    closeAndResetFilter();
  };

  return (
    <div className="flex flex-col relative">
      <MultiSelectCommand<any>
        labelKey={getLabelKey() as keyof any}
        valueKey={getValueKey() as keyof any}
        onSelectionChange={(values, options) => {
          setSelectedValues(values);
          setSelectedOptions(options);
        }}
        selectedValues={selectedValues}
        selectedOptions={selectedOptions}
        loadOptions={(query: string) => getOptions()(query) as Promise<any[]>}
        placeholder="Search..."
        showInitials={currentStaleFilter?.column.dataType === "async_list"}
        dataTestId={`${currentStaleFilter?.column.label.toLocaleLowerCase()}-multi-select`}
      />
      {/* Sticky footer with fade effect */}
      <div className="sticky bottom-0 w-full flex flex-col gap-1.5 p-2">
        <div className="absolute bottom-full w-full h-2.5 left-0 bg-gradient-to-b from-transparent to-white pointer-events-none border-b border-gray-25" />
        <ApplyFilterButton
          disabled={!selectedValues || selectedValues?.length === 0}
          title={
            selectedValues?.length === 0
              ? "Please select at least one value to apply this filter"
              : ""
          }
          onClick={handleApplyFilter}
        />
      </div>
    </div>
  );
};

export default MultiSelect;
