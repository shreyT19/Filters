import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Checkbox as CheckboxInputMain } from "~/components/ui/checkbox";
import {
  debounce,
  getInitials,
  getThemeColorForString,
  truncateString,
} from "~/utils/string.utils";
import { getThemeForKeyword } from "~/utils/themes.utils";
import { ToolTip } from "~/components/ui/tooltip";
import {
  getLabelValue as getLabelValueFn,
  getOptionValue as getOptionValueFn,
} from "~/utils/option.utils";
import { Skeleton } from "~/components/ui/skeleton";

type IKeyType<T> = T extends object ? keyof T : never;

// TODOS: Fix component and its styles

type Props<T> = {
  options?: T[];
  onSelectionChange: (values: string[], options: T[]) => void;
  placeholder?: string;
  labelKey?: IKeyType<T>;
  valueKey?: IKeyType<T>;
  iconKey?: IKeyType<T>;
  emptyPlaceholderText?: string;
  selectedValues?: string[];
  onClose?: () => void;
  loadOptions?: (query: string) => Promise<T[]>;
  selectedOptions?: T[];
  className?: string;
  showInitials?: boolean;
  truncateLength?: number;
  dataTestId?: string;
};

const MultiSelectCommand = <T,>({
  options,
  placeholder,
  onSelectionChange,
  labelKey = "label" as IKeyType<T>,
  valueKey = "value" as IKeyType<T>,
  iconKey = "icon" as IKeyType<T>,
  emptyPlaceholderText = "No results found",
  selectedValues = [],
  onClose,
  loadOptions,
  selectedOptions: selectedOptionsProp,
  className,
  showInitials = true,
  truncateLength,
  dataTestId,
}: Props<T>) => {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stateOptions, setStateOptions] = useState<T[]>(
    options ?? selectedOptionsProp ?? []
  );

  const lastQuery = useRef<HTMLInputElement | null>(null);
  const initialLoadDone = useRef<boolean>(false);

  const getLabelValue = useCallback(
    (option: T) => getLabelValueFn(option, labelKey),
    [labelKey]
  );

  const getOptionValue = useCallback(
    (option: T) => getOptionValueFn(option, valueKey),
    [valueKey]
  );

  // Update state options when options prop changes
  useEffect(() => {
    if (options) {
      setStateOptions((prevOptions) => {
        // Keep selected options that might not be in the new options
        const selectedOptionsToKeep = prevOptions.filter((option) =>
          selectedValues.includes(getOptionValue(option) || "")
        );

        // Get values of selected options to avoid duplicates
        const selectedOptionValues = selectedOptionsToKeep.map(
          (opt) => getOptionValue(opt) || ""
        );

        // Filter out options that are already in selectedOptionsToKeep
        const newOptionsFiltered = options.filter(
          (option) =>
            !selectedOptionValues.includes(getOptionValue(option) || "")
        );

        return [...selectedOptionsToKeep, ...newOptionsFiltered];
      });
    }
  }, [options, selectedValues, getOptionValue]);

  // Separate options into selected and unselected
  const selectedOptions = useMemo(() => {
    return stateOptions.filter((option) =>
      selectedValues.includes(getOptionValue(option) || "")
    );
  }, [stateOptions, selectedValues, getOptionValue]);

  const unselectedOptions = useMemo(() => {
    return stateOptions.filter(
      (option) => !selectedValues.includes(getOptionValue(option) || "")
    );
  }, [stateOptions, selectedValues, getOptionValue]);

  //* Reset hovered index when loading is done
  useEffect(() => {
    setHoveredIndex(null);
  }, [loading]);

  //* Load options on initial render if options are not provided
  useEffect(() => {
    if (loadOptions && !options && !initialLoadDone.current) {
      setLoading(true);
      initialLoadDone.current = true;
      lastQuery.current && (lastQuery.current.value = "");
      handleSearchChange("");
    }
  }, [loadOptions, options]);

  //* Handle search input changes
  const handleSearchChange = async (value: string): Promise<void> => {
    if (!loadOptions) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Wait for options to be loaded
      const data = await loadOptions(value);

      // Only set data and turn off the loading state if the result is for the last query
      if (value === lastQuery.current?.value) {
        // Preserve selected options
        const currentSelectedOptions = stateOptions.filter((option) =>
          selectedValues.includes(getOptionValue(option) || "")
        );

        // Get values of selected options to avoid duplicates
        const selectedOptionValues = currentSelectedOptions.map(
          (opt) => getOptionValue(opt) || ""
        );

        // Filter out options that are already in currentSelectedOptions
        const newOptionsFiltered = data.filter(
          (option) =>
            !selectedOptionValues.includes(getOptionValue(option) || "")
        );

        setStateOptions([...currentSelectedOptions, ...newOptionsFiltered]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading options:", error);
      setLoading(false);
    }
  };

  const debouncedHandleInputChange = useCallback(debounce(handleSearchChange), [
    lastQuery,
    getOptionValue,
    selectedValues,
    stateOptions,
  ]);

  // Function to handle selection change
  const handleSelectionChange = (option: T, isSelected: boolean) => {
    const optionValue = getOptionValue(option);

    let newSelectedValues: string[];
    let newSelectedOptions: T[];

    if (isSelected) {
      // Add to selection
      newSelectedValues = [...selectedValues, optionValue || ""];
      newSelectedOptions = [...selectedOptions, option];
    } else {
      // Remove from selection
      newSelectedValues = selectedValues.filter((val) => val !== optionValue);
      newSelectedOptions = selectedOptions.filter(
        (opt) => getOptionValue(opt) !== optionValue
      );
    }

    onSelectionChange(newSelectedValues, newSelectedOptions);
  };

  // Function to render an option with initials
  const renderOption = (
    option: T,
    isSelected: boolean,
    itemType: "selected" | "unselected",
    index: number
  ) => {
    const optionValue = getOptionValue(option);
    const label = getLabelValue(option);
    // Adjust truncation length based on whether initials are shown and custom truncate length
    const defaultTruncationLength = showInitials ? 17 : 34;
    const truncationLength = truncateLength || defaultTruncationLength;
    const truncatedLabel = truncateString(label, truncationLength);
    const isLabelTruncated = label.length > truncationLength;
    const itemId = `${itemType}-${index}`;
    const isHovered = hoveredIndex === itemId;

    // Get theme color and extract background class
    const themeColor = getThemeColorForString(label);
    const theme = getThemeForKeyword(themeColor, "filled");

    // Create a name element with tooltip if truncated
    const nameElement = (
      <span className="truncate text-gray-8000 text-s font-semibold">
        {truncatedLabel}
      </span>
    );

    // Handle item click (not on checkbox)
    const handleItemClick = (e: React.MouseEvent) => {
      // Check if the click was on the checkbox or its container
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.closest("#multiselect-checkbox-container")
      ) {
        // Click was on checkbox, don't do anything as the onChange handler will handle it
        return;
      }

      // Click was on the item but not on checkbox, select and close
      handleSelectionChange(option, !isSelected);
      if (onClose) onClose();
    };

    if (loading && !isSelected) {
      return (
        <div className="flex gap-2 items-center w-full p-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <Skeleton className="w-full h-full flex-1/5" />
          <Skeleton className="w-full h-full flex-4/5" />
        </div>
      );
    }

    return (
      <div
        className="flex items-center w-full p-2 hover:bg-violet-50 transition-all duration-150 rounded-md cursor-pointer gap-2"
        onMouseEnter={() => setHoveredIndex(itemId)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={handleItemClick}
        data-testid={`${dataTestId}-${itemType}-${index}`}
      >
        <div
          id="multiselect-checkbox-container"
          className="flex items-center justify-center h-5 w-5"
        >
          {isSelected || isHovered ? (
            <CheckboxInputMain
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectionChange(
                  option,
                  (e.target as HTMLInputElement).checked
                );
              }}
            />
          ) : null}
          {!isSelected && !isHovered ? <div className="w-full h-full" /> : null}
        </div>
        <div className="flex items-center overflow-hidden">
          {Boolean(option[iconKey]) && (
            <span className="shrink-0 mr-2">{option[iconKey] as any}</span>
          )}
          {showInitials && !Boolean(option[iconKey]) && (
            <div
              className={`flex-shrink-0 flex items-center justify-center leading-[initial] align-middle text-center font-semibold text-[0.688rem] mr-2 w-6 h-6 rounded-full ${theme.bg} ${theme.text}`}
            >
              {getInitials(label, { maxInitials: 2 })}
            </div>
          )}
          {isLabelTruncated ? (
            <ToolTip
              title={<span className="text-gray-8000">{label}</span>}
              align="start"
            >
              {nameElement}
            </ToolTip>
          ) : (
            nameElement
          )}
        </div>
      </div>
    );
  };

  return (
    <Command
      shouldFilter={!loadOptions}
      className={className}
      data-testid={dataTestId}
    >
      <CommandInput
        ref={lastQuery}
        placeholder={placeholder}
        onValueChange={(val: string) => debouncedHandleInputChange(val)}
      />
      <CommandList>
        <CommandEmpty className="py-2.5 px-6 flex items-center justify-center text-s font-medium text-gray-4000">
          {emptyPlaceholderText}
        </CommandEmpty>

        {/* Always show selected options section if there are any selected options */}
        {Boolean(selectedOptions?.length > 0) && (
          <CommandGroup>
            {selectedOptions.map((option, index) => {
              return (
                <CommandItem
                  key={`selected-${index}`}
                  onSelect={() => event?.preventDefault()}
                  className="!rounded-none !p-0 !bg-white"
                >
                  {renderOption(option, true, "selected", index)}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {selectedOptions.length > 0 && unselectedOptions.length > 0 && (
          <div className="-mx-1 h-px bg-neutral-200" />
        )}

        {/* Only show separator if there are unselected options or loading */}

        {/* Show loading skeletons only if there are async options to load */}
        {Boolean(loadOptions) && loading && (
          <CommandGroup>
            {Array.from({ length: 8 }).map((_, index) => (
              <CommandItem
                key={`loading-${index}`}
                className="!rounded-none !p-0 !bg-white"
                onSelect={() => event?.preventDefault()}
              >
                <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                  <Skeleton className="w-full h-full flex-1/5" />
                  <Skeleton className="w-full h-full flex-4/5" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Show unselected options if available */}
        {Boolean(unselectedOptions?.length > 0) && (
          <CommandGroup>
            {unselectedOptions.map((option, index) => {
              return (
                <CommandItem
                  key={`unselected-${index}`}
                  onSelect={() => event?.preventDefault()}
                  className="!rounded-none !p-0 !bg-white"
                >
                  {renderOption(option, false, "unselected", index)}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default MultiSelectCommand;
