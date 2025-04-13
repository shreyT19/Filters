"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type IComboboxProps<T extends Record<string, any>> = {
  options: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSelect?: (value: string) => void;
};

export function ComboboxDemo<T extends Record<string, any>>({
  options,
  labelKey,
  valueKey,
  placeholder = "Select framework...",
  searchPlaceholder = "Search framework...",
  emptyMessage = "No framework found.",
  onSelect,
}: IComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    if (onSelect) onSelect(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => String(option[valueKey]) === value)?.[
                labelKey as keyof T
              ]
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={String(option[valueKey])}
                  onSelect={handleSelect}
                >
                  {String(option[labelKey])}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === String(option[valueKey])
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
