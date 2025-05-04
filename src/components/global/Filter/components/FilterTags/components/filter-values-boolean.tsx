import { useMemo } from "react";
import {
  IFilterColumnBoolean,
  IFilterColumnCustom,
  IFilter,
} from "../../../../../../types/filter.types";

const FilterValuesForBoolean = ({ filter }: { filter: IFilter }) => {
  if (filter.subDataType === "boolean" || filter.dataType === "boolean") {
    const effectiveFilterColumn = useMemo(() => {
      const filterColumn = filter.column as IFilterColumnBoolean;
      const _filterColumn = filter.column as IFilterColumnCustom;
      if (_filterColumn.dataType === "custom") {
        return _filterColumn.conditionProps?.find(
          (condition) => condition.filterColumn.dataType === "boolean"
        )?.filterColumn;
      }
      return filterColumn;
    }, [filter]) as IFilterColumnBoolean;

    return (
      <>
        {filter.selectedValue?.value
          ? effectiveFilterColumn?.valueProps?.displayLabels?.true || "True"
          : effectiveFilterColumn?.valueProps?.displayLabels?.false || "False"}
      </>
    );
  }
  return null;
};

export default FilterValuesForBoolean;
