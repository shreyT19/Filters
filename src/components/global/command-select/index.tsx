"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "~/components/ui/command";
import { getLabelValue, getOptionValue } from "~/utils/option.utils";
import * as React from "react";

type IKeyType<T> = T extends object ? keyof T : never;

type Props<T> = {
  options: T[];
  heading?: string;
  onSelect: (value: string | undefined, option: T) => void;
  placeholder?: string;
  labelKey?: IKeyType<T>;
  valueKey?: IKeyType<T>;
  iconKey?: IKeyType<T>;
  emptyPlaceholderText?: string;
  showSearch?: boolean;
  showKeyboardShortcut?: boolean;
  dataTestId?: string;
};

export function CommandSelect<T>({
  options,
  heading,
  onSelect,
  placeholder = "Type a command or search...",
  labelKey,
  valueKey,
  iconKey,
  emptyPlaceholderText = "No results found.",
  showSearch = true,
  showKeyboardShortcut = false,
  dataTestId,
}: Props<T>) {
  const handleSelect = (currentValue: string, option: T) => {
    onSelect(currentValue, option);
  };

  return (
    <Command className="!p-0" data-testid={dataTestId}>
      {showSearch && <CommandInput placeholder={placeholder} />}
      <CommandList>
        <CommandEmpty>{emptyPlaceholderText}</CommandEmpty>
        {heading && (
          <CommandGroup heading={heading}>
            {options.map((option, index) => {
              const optionValue =
                getOptionValue(option, valueKey!) || String(index);
              const optionLabel =
                getLabelValue(option, labelKey!) || String(option);
              const Icon =
                iconKey && option[iconKey]
                  ? (option[iconKey] as React.ElementType)
                  : null;

              return (
                <CommandItem
                  key={index}
                  value={optionValue}
                  onSelect={(currentValue) =>
                    handleSelect(currentValue, option)
                  }
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  <span>{optionLabel}</span>
                  {showKeyboardShortcut && index < 9 && (
                    <CommandShortcut>⌘{index + 1}</CommandShortcut>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        {!heading &&
          options.map((option, index) => {
            const optionValue =
              getOptionValue(option, valueKey!) || String(index);
            const optionLabel =
              getLabelValue(option, labelKey!) || String(option);
            const Icon =
              iconKey && option[iconKey]
                ? (option[iconKey] as React.ElementType)
                : null;

            return (
              <CommandItem
                key={index}
                value={optionValue}
                onSelect={(currentValue) => handleSelect(currentValue, option)}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                <span>{optionLabel}</span>
                {showKeyboardShortcut && index < 9 && (
                  <CommandShortcut>⌘{index + 1}</CommandShortcut>
                )}
              </CommandItem>
            );
          })}
      </CommandList>
    </Command>
  );
}

export default CommandSelect;
