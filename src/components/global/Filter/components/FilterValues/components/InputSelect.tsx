import { useRef, useState, useEffect } from "react";
import { useFilterContext } from "../../../context/filter.context";
import {
  EFilterStringCondition,
  type IFilterColumnCustomFilterCondition,
} from "~/types/filter.types";
import { Input } from "~/components/ui/input";
import ApplyFilterButton from "../../ApplyFilterButton";

type Props = {
  type?: "string" | "number";
  customFilterCondition?: IFilterColumnCustomFilterCondition;
};
const InputSelect = ({ type = "string", customFilterCondition }: Props) => {
  const { currentStaleFilter, addOrUpdateFilter, closeAndResetFilter } =
    useFilterContext();
  const [value, setValue] = useState<string | number>(
    (currentStaleFilter?.selectedValue?.value as string | number) || ""
  );
  const focusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current?.focus();
    }
  }, [focusRef.current, type]);

  const handleApplyFilter = () => {
    addOrUpdateFilter({
      ...currentStaleFilter!,
      selectedCondition:
        (customFilterCondition?.value as EFilterStringCondition) ??
        ((type === "string"
          ? EFilterStringCondition.CONTAINS
          : currentStaleFilter?.selectedCondition) as EFilterStringCondition),
      selectedValue: {
        value: type === "number" ? Number(value) : value,
      },
    });
    closeAndResetFilter();
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      {type === "string" ? (
        <Input
          ref={focusRef}
          placeholder={currentStaleFilter?.column?.label}
          value={String(value)}
          onChange={(e) => setValue(String(e.target.value))}
          data-testid={`${currentStaleFilter?.column?.label.toLocaleLowerCase()}-string-input`}
        />
      ) : (
        <Input
          ref={focusRef}
          type="number"
          placeholder={currentStaleFilter?.column?.label}
          value={Number(value)}
          onChange={(e) => setValue(Number(e.target.value))}
          data-testid={`${currentStaleFilter?.column?.label.toLocaleLowerCase()}-number-input`}
        />
      )}
      <ApplyFilterButton
        disabled={!value}
        onClick={handleApplyFilter}
        title={!value ? "Please enter a value to apply this filter" : ""}
      >
        Apply
      </ApplyFilterButton>
    </div>
  );
};

export default InputSelect;
