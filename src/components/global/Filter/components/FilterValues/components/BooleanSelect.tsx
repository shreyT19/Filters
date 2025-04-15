import React from "react";
import { useFilterContext } from "../../../context/filter.context";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  EFilterBooleanCondition,
  type IFilterColumnBoolean,
} from "~/types/filter.types";

const BooleanSelect = () => {
  const { currentStaleFilter, addOrUpdateFilter, closeAndResetFilter } =
    useFilterContext();

  const handleValueChange = (value: string) => {
    addOrUpdateFilter({
      ...currentStaleFilter!,
      selectedCondition: EFilterBooleanCondition.IS,
      selectedValue: {
        value: value === "true",
      },
    });
    closeAndResetFilter();
  };

  const filterColumn = currentStaleFilter?.column as IFilterColumnBoolean;

  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {[
            {
              value: true.toString(),
              label: filterColumn?.valueProps?.displayLabels?.true,
            },
            {
              value: false.toString(),
              label: filterColumn?.valueProps?.displayLabels?.false,
            },
          ].map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(currentValue) => handleValueChange(currentValue)}
            >
              {option.label}
              <Check
                className={cn(
                  "ml-auto",
                  currentStaleFilter?.selectedValue?.value?.toString() ===
                    option.value
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default BooleanSelect;
