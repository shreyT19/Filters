import * as React from "react";
import { useFilterContext } from "../../context/filter.context";
import type { IFilterConditionDataType } from "~/types/filter.types";
import InputSelect from "./components/InputSelect";
import DateSelect from "./components/DateSelect";
import BooleanSelect from "./components/BooleanSelect";
import MultiSelect from "./components/MultiSelect";

const FilterValues = () => {
  const { currentStaleFilter } = useFilterContext();
  // Determine which data type to use (either main dataType or subDataType for custom filters)
  const effectiveDataType: IFilterConditionDataType | undefined =
    React.useMemo(() => {
      if (currentStaleFilter?.dataType === "custom") {
        return currentStaleFilter.subDataType;
      }
      return currentStaleFilter?.dataType;
    }, [currentStaleFilter]);

  // If no filter or data type is selected, don't render anything
  if (!effectiveDataType) {
    return null;
  }

  // Map data types to their corresponding components
  switch (effectiveDataType) {
    case "string":
      return <InputSelect />;

    case "number":
      return <InputSelect />;

    case "date":
      return <DateSelect />;

    case "boolean":
      return <BooleanSelect />;

    case "enum":
    case "object":
    case "async_list":
      return <MultiSelect />;

    default:
      return null;
  }
};

export default FilterValues;
