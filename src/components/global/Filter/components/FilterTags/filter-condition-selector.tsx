import {
  IFilterColumnAsyncList,
  IFilterColumnCustom,
  IFilter,
} from "../../../../../types/filter.types";
import FilterConditions from "../FilterConditions";
import { FILTER_V2_TEST_IDS } from "~/utils/filter.utils";
import { useFilterContext } from "../../context/filter.context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type Props = {
  filter: IFilter;
  index: number;
  isOpen: boolean;
  onOpenChange: (id: string, open: boolean) => void;
};

const FilterConditionSelectorInTags = ({
  filter,
  index,
  isOpen,
  onOpenChange,
}: Props) => {
  if (
    filter?.dataType !== "date" &&
    filter?.dataType !== "custom" &&
    filter?.dataType !== "number" &&
    !(
      (filter?.dataType === "async_list" ||
        filter?.dataType === "object" ||
        filter?.dataType === "enum") &&
      (filter?.column as IFilterColumnAsyncList<unknown>)?.valueProps
        ?.enableNegativeConditions
    )
  ) {
    return (
      <span
        className="text-gray-70 text-xs px-1.5 py-1 rounded"
        data-testid={`${FILTER_V2_TEST_IDS.filterTagSelectedCondition}-${index}`}
        aria-label="non clickable"
      >
        {filter?.selectedCondition}
      </span>
    );
  }

  const { setCurrentStaleFilter } = useFilterContext();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open: boolean) => onOpenChange(filter?.id!, open)}
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
          data-testid={`${FILTER_V2_TEST_IDS.filterTagSelectedCondition}-${index}`}
          aria-label="clickable"
        >
          {filter?.dataType === "custom"
            ? (
                filter?.column as IFilterColumnCustom<unknown>
              )?.conditionProps?.find(
                (condition) => condition.value === filter?.selectedCondition
              )?.label
            : filter?.selectedCondition}
        </span>
      </PopoverTrigger>
      <PopoverContent className="!p-0 min-w-3xs" align="start">
        <FilterConditions showBackButton={false} />
      </PopoverContent>
    </Popover>
  );
};

export default FilterConditionSelectorInTags;
