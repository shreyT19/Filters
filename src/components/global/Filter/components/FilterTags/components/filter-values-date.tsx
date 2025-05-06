import dayjs from "dayjs";
import {
  EFilterDateCondition,
  IFilterColumnDate,
  IFilter,
} from "../../../../../../types/filter.types";

export const displayDateFormat = "MMM DD, YYYY";

const FilterValuesForDate = ({ filter }: { filter: IFilter }) => {
  if (filter?.dataType !== "date") return null;

  const isTimestamp = (filter.column as IFilterColumnDate)?.valueProps
    ?.isTimestamp;
  const condition =
    filter?.selectedCondition as unknown as EFilterDateCondition;
  const value = filter?.selectedValue?.value;

  const formatDate = (date: string) => {
    const formattedDate = dayjs(date).format(displayDateFormat);
    return isTimestamp
      ? `${formattedDate} ${dayjs(date).format("HH:mm:ss")}`
      : formattedDate;
  };

  return <>{typeof value === "string" ? formatDate(value) : null}</>;
};

export default FilterValuesForDate;
