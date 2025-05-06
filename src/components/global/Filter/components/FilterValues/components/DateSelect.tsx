import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import ApplyFilterButton from "../../ApplyFilterButton";
import { EFilterDateCondition, IFilterColumnDate } from "~/types/filter.types";
import { useFilterContext } from "../../../context/filter.context";
import DatePicker from "~/components/ui/calendar";

export const timestampDateFormat = "YYYY-MM-DD[T]HH:mm:ss";

// Utility function to format date based on condition
const formatDateForCondition = (
  date: Dayjs,
  condition: EFilterDateCondition,
  isStart: boolean = true,
  isFilterTimestamp: boolean = false
): string => {
  let formattedDate = date.clone();

  // Only adjust to start/end of day if not using timestamp
  if (!isFilterTimestamp) {
    // For range start dates or conditions that need start of day
    if (
      isStart ||
      condition === EFilterDateCondition.IS ||
      condition === EFilterDateCondition.IS_ON_OR_AFTER ||
      condition === EFilterDateCondition.IS_BEFORE
    ) {
      formattedDate = formattedDate.startOf("day");
    }

    // For range end dates or conditions that need end of day
    if (
      !isStart ||
      condition === EFilterDateCondition.IS_AFTER ||
      condition === EFilterDateCondition.IS_ON_OR_BEFORE
    ) {
      formattedDate = formattedDate.endOf("day");
    }
  }

  // Use ISO format for API requests to match the expected format
  return formattedDate.format(timestampDateFormat);
};

const DateSelect = () => {
  const { currentStaleFilter, addOrUpdateFilter, closeAndResetFilter } =
    useFilterContext();

  const dateFilter = currentStaleFilter?.column as IFilterColumnDate;
  const condition =
    currentStaleFilter?.selectedCondition as EFilterDateCondition;

  const isFilterTimestamp = dateFilter?.valueProps?.isTimestamp;

  // Extract the current filter value for easier access
  const currentFilterValue = currentStaleFilter?.selectedValue?.value;

  // Check if the current value is a string
  const isStringValue = typeof currentFilterValue === "string";

  // Check if the current value is an array
  const isArrayValue = Array.isArray(currentFilterValue);

  // Get the first value from array if it exists
  const firstArrayValue =
    isArrayValue && currentFilterValue.length > 0
      ? (currentFilterValue[0] as string)
      : null;

  // Determine the initial single date value
  const initialDateValue = isStringValue ? currentFilterValue : firstArrayValue;

  // State for single date value (used for most date conditions)
  const [dateValue, setDateValue] = useState<string | null>(initialDateValue);

  const handleApplyFilter = () => {
    if (dateValue) {
      const formattedDate = formatDateForCondition(
        dayjs(dateValue, { format: timestampDateFormat }),
        condition,
        true,
        isFilterTimestamp
      );

      addOrUpdateFilter({
        ...currentStaleFilter!,
        selectedValue: {
          value: formattedDate,
        },
      });
      closeAndResetFilter();
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 w-full">
      {/* Date Range Picker is only shown for IS_BETWEEN condition */}

      <DatePicker
        selected={
          dateValue
            ? dayjs(dateValue, { format: timestampDateFormat }).toDate()
            : undefined
        }
        onSelect={(date) => {
          if (date) {
            setDateValue(
              formatDateForCondition(
                dayjs(date),
                condition,
                true,
                isFilterTimestamp
              )
            );
          }
        }}
        mode="single"
      />

      <ApplyFilterButton
        disabled={!dateValue}
        onClick={handleApplyFilter}
        title={!dateValue ? "Please select a date to apply this filter" : ""}
      >
        Apply
      </ApplyFilterButton>
    </div>
  );
};

export default DateSelect;
