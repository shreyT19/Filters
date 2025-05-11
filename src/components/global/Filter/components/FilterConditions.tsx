import { useEffect, useMemo, useState } from "react";
import {
  type IFilterColumnCustom,
  type IFilterColumnCustomFilterCondition,
  type IFilterStringCondition,
  type IFilterColumnAsyncList,
  EFilterObjectCondition,
} from "~/types/filter.types";
import {
  FILTER_V2_TEST_IDS,
  filterConditionsForObject,
  getFilterConditionsFromDataType,
  SHOW_FILTER_CONDITIONS_DATA_TYPES,
} from "~/utils/filter.utils";
import { useFilterContext } from "~/components/global/Filter/context/filter.context";
import CommandSelect from "../../command-select";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FilterValues from "~/components/global/Filter/components/FilterValues/FilterValues";

const FilterConditions = ({
  showBackButton = true,
}: {
  showBackButton?: boolean;
}) => {
  const { currentStaleFilter, setCurrentStaleFilter } = useFilterContext();

  const [showFilterValues, setShowFilterValues] = useState<boolean>(false);
  const dataType = currentStaleFilter?.dataType!;

  // Check if we should skip filter conditions for certain data types
  const shouldSkipFilterConditions = useMemo(() => {
    // For async_list, object, or enum types, check if negative conditions are enabled
    if (
      dataType === "async_list" ||
      dataType === "object" ||
      dataType === "enum"
    ) {
      // Only show filter conditions if enableNegativeConditions is true in the component props
      // AND if it's enabled in the column configuration
      return !(currentStaleFilter?.column as IFilterColumnAsyncList)?.valueProps
        ?.enableNegativeConditions;
    }

    // For other data types, check if they should show filter conditions
    return !SHOW_FILTER_CONDITIONS_DATA_TYPES.includes(dataType);
  }, [currentStaleFilter, dataType]);

  const filterConditions = useMemo(() => {
    const dataType = currentStaleFilter?.dataType;
    const customConditions =
      dataType === "custom"
        ? (currentStaleFilter?.column as IFilterColumnCustom).conditionProps
        : undefined;

    const _filterConditions = getFilterConditionsFromDataType(
      dataType!,
      customConditions as IFilterColumnCustomFilterCondition[]
    );

    // Add negative conditions if enableNegativeConditions is true
    if (
      (dataType === "async_list" ||
        dataType === "object" ||
        dataType === "enum") &&
      (currentStaleFilter?.column as IFilterColumnAsyncList)?.valueProps
        ?.enableNegativeConditions
    ) {
      const selectedValues = currentStaleFilter?.selectedValue
        ?.value as string[];
      if (selectedValues?.length > 1) {
        return filterConditionsForObject.filter((condition) => {
          return (
            condition.value === EFilterObjectCondition.IS_ANY_OF ||
            condition.value === EFilterObjectCondition.IS_NOT_ANY_OF
          );
        });
      }
      return filterConditionsForObject.filter((condition) => {
        return (
          condition.value === EFilterObjectCondition.IS ||
          condition.value === EFilterObjectCondition.IS_NOT
        );
      });
    }

    return _filterConditions as { label: string; value: string }[];
  }, [currentStaleFilter]);

  useEffect(() => {
    if (shouldSkipFilterConditions) {
      setShowFilterValues(true);
    }
  }, [shouldSkipFilterConditions]);

  return (
    <div className="flex flex-col">
      {showBackButton && (
        <div className="flex items-center gap-1 border-b px-2 py-1.5">
          <Button
            size="icon"
            variant="ghost"
            className="outline-none border-none !text-gray-400 !p-1 !h-fit !w-fit"
            onClick={() => setCurrentStaleFilter(null)}
            data-testid={FILTER_V2_TEST_IDS.filterConditionBackButton}
          >
            <ArrowLeft className="w-2 h-2" />
          </Button>
          <span className="text-sm font-normal text-gray-400">
            {currentStaleFilter?.column?.label}
          </span>
        </div>
      )}
      <div>
        {showFilterValues ? (
          <FilterValues />
        ) : (
          <CommandSelect
            options={filterConditions}
            labelKey="label"
            valueKey="value"
            placeholder="Filter by..."
            onSelect={(value, option) => {
              const customOption =
                dataType === "custom"
                  ? (option as IFilterColumnCustomFilterCondition)
                  : undefined;

              setCurrentStaleFilter({
                ...currentStaleFilter!,
                selectedCondition: value as IFilterStringCondition,
                subDataType: customOption?.filterColumn?.dataType,
                subDataTypeMetaData: customOption,
              });
              setShowFilterValues(true);
            }}
            emptyPlaceholderText="No matching filters found"
            showSearch={false}
            dataTestId={FILTER_V2_TEST_IDS.filterConditionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default FilterConditions;
