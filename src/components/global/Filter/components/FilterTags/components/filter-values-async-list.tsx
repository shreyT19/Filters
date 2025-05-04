import { ToolTip } from "~/components/ui/tooltip";
import {
  IFilterColumnAsyncList,
  IFilter,
} from "../../../../../../types/filter.types";

const FilterValuesForAsyncList = ({ filter }: { filter: IFilter }) => {
  const filterColumnAsyncList = filter.column as IFilterColumnAsyncList;

  const metaData = filter.selectedValue?.metaData as Record<string, unknown>[];

  return (
    <>
      <span>
        {
          metaData?.[0]?.[
            filterColumnAsyncList.valueProps.labelKey ?? "label"
          ] as string
        }
      </span>
      {metaData?.length > 1 && (
        <ToolTip
          title={
            <span className="text-gray-8000">
              {metaData
                .slice(1)
                .map(
                  (item) =>
                    item[
                      filterColumnAsyncList.valueProps.labelKey ?? "label"
                    ] as string
                )
                .join(", ")}
            </span>
          }
        >
          <span>, +{metaData.length - 1}</span>
        </ToolTip>
      )}
    </>
  );
};

export default FilterValuesForAsyncList;
