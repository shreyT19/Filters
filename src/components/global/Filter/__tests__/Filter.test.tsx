import {
  EFilterBooleanCondition,
  EFilterDateCondition,
  EFilterEnumCondition,
  EFilterNumberCondition,
  EFilterObjectCondition,
  EFilterStringCondition,
  IFilterColumnBoolean,
  IFilterColumnEnum,
  IFilterColumnObject,
  IFilter,
} from "~/types/filter.types";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  renderHook,
  within,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, vi, it } from "vitest";
import {
  mockIntersectionObserver,
  mockResizeObserver,
} from "~/utils/vitest.utils";

import { startCase } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import { displayDateFormat } from "../components/FilterTags/components/filter-values-date";
import { FILTER_V2_TEST_IDS } from "~/utils/filter.utils";
import TableFilterV2 from "../Filter";

import { sampleFilterColumns, type SampleFilterColumn } from "./mockData";

// Mock IntersectionObserver
mockIntersectionObserver();
// Mock ResizeObserver
mockResizeObserver();
// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

const numberFilterConditions = Object.keys(EFilterNumberCondition);
const dateFilterConditions = Object.keys(EFilterDateCondition);

// Helper functions for common test operations
const searchForFilterOption = (filterOption: string) => {
  const filterOptionSearchInput = screen.getByTestId(
    `${FILTER_V2_TEST_IDS.filterOptionsSelect}-search`
  );
  fireEvent.change(filterOptionSearchInput, {
    target: { value: filterOption },
  });
};

const verifyFilterTag = (option: string, condition: string, value: string) => {
  const filterTag = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
  expect(filterTag).toBeInTheDocument();

  const filterTagOption = screen.getByText(option);
  expect(filterTagOption).toBeInTheDocument();

  const filterTagCondition = screen.getByText(condition);
  expect(filterTagCondition).toBeInTheDocument();

  const filterTagValue = screen.getByText(value);
  expect(filterTagValue).toBeInTheDocument();
};

// Setup function for filter tests with state management
const setupFilterTest = () => {
  const onFiltersChangeMock = vi.fn();
  const { unmount, result } = renderHook(() => {
    const [filters, setFilters] = useState<IFilter<SampleFilterColumn>[]>([]);

    const handleFiltersChange = (newFilters: IFilter<SampleFilterColumn>[]) => {
      setFilters(newFilters);
      onFiltersChangeMock(newFilters);
    };

    return {
      filters,
      element: (
        <TableFilterV2
          filterColumns={sampleFilterColumns}
          filters={filters}
          onApply={vi.fn()}
          onFiltersChange={
            handleFiltersChange as Dispatch<
              SetStateAction<IFilter<SampleFilterColumn>[]>
            >
          }
        />
      ),
    };
  });

  const { rerender } = render(result.current.element);

  return {
    onFiltersChangeMock,
    result,
    rerender: () => rerender(result.current.element),
    unmount,
  };
};

// Common UI interactions
const openFilterPopover = () => {
  fireEvent.click(screen.getByTestId(FILTER_V2_TEST_IDS.filterButton));
};

const selectFilterOption = (index: number) => {
  fireEvent.click(
    screen.getByTestId(`${FILTER_V2_TEST_IDS.filterOptionsSelect}-${index}`)
  );
};

const applyFilter = () => {
  fireEvent.click(screen.getByTestId(FILTER_V2_TEST_IDS.filterApplyButton));
};

describe("TableFilterV2", () => {
  // This is crucial - create a dedicated portal container
  beforeAll(() => {
    // Add a div where Radix will create portals
    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "radix-portal-root");
    document.body.appendChild(portalRoot);
  });

  // Clean up after each test
  afterEach(() => {
    cleanup();
    // Additional cleanup for any portals that might persist
    document.body.querySelectorAll("[data-radix-portal]").forEach((node) => {
      node.remove();
    });
  });

  it("should render filter options popover when F is pressed", async () => {
    const { unmount } = render(
      <TableFilterV2
        filterColumns={sampleFilterColumns}
        filters={[]}
        onApply={vi.fn()}
        onFiltersChange={vi.fn()}
      />
    );

    fireEvent.keyDown(document.body, {
      key: "f",
      code: "f",
    });

    const filterPopoverContent = screen.queryByTestId(
      FILTER_V2_TEST_IDS.filterOptionsPopoverContent
    );

    expect(filterPopoverContent).toBeInTheDocument();
    fireEvent.keyDown(document.body, {
      key: "Escape",
      code: "Escape",
    });
    expect(filterPopoverContent).not.toBeInTheDocument();
    unmount();
  });

  it("should render filter options popover when filter button is clicked", async () => {
    const onFiltersChangeMock = vi.fn();
    const { unmount, result } = renderHook(() => {
      const [filters, setFilters] = useState<IFilter<SampleFilterColumn>[]>([]);

      const handleFiltersChange = (
        newFilters: IFilter<SampleFilterColumn>[]
      ) => {
        setFilters(newFilters);
        onFiltersChangeMock(newFilters);
      };

      return {
        filters,
        element: (
          <TableFilterV2
            filterColumns={sampleFilterColumns}
            filters={filters}
            onApply={vi.fn()}
            onFiltersChange={
              handleFiltersChange as Dispatch<
                SetStateAction<IFilter<SampleFilterColumn>[]>
              >
            }
          />
        ),
      };
    });

    render(result.current.element);

    openFilterPopover();

    const filterPopoverContent = screen.queryByTestId(
      FILTER_V2_TEST_IDS.filterOptionsPopoverContent
    );

    // Search for amount filter
    searchForFilterOption(sampleFilterColumns?.[1]?.label!);

    const triggerFilterOption = screen.getByTestId(
      `${FILTER_V2_TEST_IDS.filterOptionsSelect}-1`
    );

    fireEvent.click(triggerFilterOption);

    // Test back button
    await waitFor(() =>
      fireEvent.click(
        screen.getByTestId(FILTER_V2_TEST_IDS.filterConditionBackButton)
      )
    );

    expect(filterPopoverContent).toBeInTheDocument();
    unmount();
  });

  it("should be able to add a number filter", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[1]?.label!);
    selectFilterOption(1);

    const filterConditions = Array.from(
      { length: numberFilterConditions.length },
      (_, index) =>
        screen.getByTestId(
          `${FILTER_V2_TEST_IDS.filterConditionSelect}-${index}`
        )
    );

    // Check that each condition has the correct text content
    const conditionTexts = filterConditions.map(
      (condition) => condition.textContent
    );

    expect(conditionTexts).toEqual(
      expect.arrayContaining(
        numberFilterConditions.map((condition) =>
          startCase(condition.toLowerCase())
        )
      )
    );
    // Verify that the number of filter conditions matches the expected count
    expect(filterConditions).toHaveLength(numberFilterConditions.length);

    // Click on the first filter condition (EQUALS)
    fireEvent.click(filterConditions[0] as HTMLDivElement);

    // Find the number input field for the amount filter
    const filterValueInput = screen.getByTestId(
      `${sampleFilterColumns?.[1]?.key}-number-input`
    ) as HTMLInputElement;

    // Enter the value 100 into the input field
    fireEvent.change(filterValueInput, { target: { value: 100 } });

    // Click the apply button to add the filter
    applyFilter();

    // Verify that the filter change callback was called
    expect(onFiltersChangeMock).toHaveBeenCalled();
    const savedFilter = onFiltersChangeMock!.mock!.calls![0]![0]![0]!;

    // Verify the filter condition and value
    expect(savedFilter.selectedCondition).toBe(EFilterNumberCondition.EQUALS);
    expect(savedFilter.selectedValue.value).toBe(100);

    // Re-render the component with the updated filters
    rerender();

    // Verify that the filter tags container is now in the document
    const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
    expect(filterTags).toBeInTheDocument();

    // Verify the filter tag content
    verifyFilterTag(
      sampleFilterColumns?.[1]?.label!,
      EFilterNumberCondition.EQUALS,
      "100"
    );

    unmount();
  });

  it("should be able to add a date filter", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[2]?.label!);
    selectFilterOption(2);

    const filterConditions = Array.from(
      { length: dateFilterConditions.length },
      (_, index) =>
        screen.getByTestId(
          `${FILTER_V2_TEST_IDS.filterConditionSelect}-${index}`
        )
    );

    // Check that each condition has the correct text content
    const conditionTexts = filterConditions.map(
      (condition) => condition.textContent
    );

    expect(conditionTexts).toEqual(
      expect.arrayContaining(
        dateFilterConditions.map((condition) =>
          startCase(condition.toLowerCase())
        )
      )
    );

    expect(filterConditions).toHaveLength(dateFilterConditions.length);

    // Click on the first filter condition (EQUALS)
    fireEvent.click(filterConditions[0] as HTMLDivElement);

    // Find the date input field
    const filterValueInput = screen.getByTestId(
      `${sampleFilterColumns?.[2]?.key}-date-picker`
    );

    const date = screen.getAllByRole("gridcell")[8] as HTMLButtonElement;

    // click on any date
    fireEvent.click(date);

    // Click enter key
    fireEvent.keyDown(filterValueInput, {
      key: "Enter",
      code: "Enter",
    });

    // Verify that the filter change callback was called
    expect(onFiltersChangeMock).toHaveBeenCalled();
    const savedFilter = onFiltersChangeMock!.mock!.calls![0]![0]![0]!;

    // Verify the filter condition and value
    expect(savedFilter.selectedCondition).toBe(EFilterDateCondition.IS);
    expect(savedFilter.selectedValue.value).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    );

    // Re-render the component with the updated filters
    rerender();

    // Verify that the filter tags container is now in the document
    const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
    expect(filterTags).toBeInTheDocument();

    // Verify the filter tag content
    const selectedDate = dayjs().date(5).format(displayDateFormat);
    verifyFilterTag(
      sampleFilterColumns?.[2]?.label!,
      EFilterDateCondition.IS,
      selectedDate
    );

    unmount();
  });

  it("should be able to add a boolean filter", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[3]?.label!);
    selectFilterOption(3);
    const filterConditions = Array.from({ length: 2 }, (_, index) =>
      screen.getByTestId(
        `${startCase(
          sampleFilterColumns?.[3]?.key!
        ).toLowerCase()}-boolean-select-${index}`
      )
    );

    // Check that each condition has the correct text content
    const conditionTexts = filterConditions.map(
      (condition) => condition.textContent
    );

    expect(conditionTexts).toEqual(
      expect.arrayContaining(
        Object.values(
          (sampleFilterColumns[3] as IFilterColumnBoolean).valueProps
            .displayLabels || {
            true: "True",
            false: "False",
          }
        )
      )
    );

    expect(filterConditions).toHaveLength(2);

    // Click on the first option (Is Enabled)
    fireEvent.click(filterConditions[0] as HTMLDivElement);

    // Verify that the filter change callback was called
    expect(onFiltersChangeMock).toHaveBeenCalled();
    const savedFilter = onFiltersChangeMock!.mock!.calls![0]![0]![0]!;

    // Verify the selected value is true (Is Enabled)
    expect(savedFilter.selectedValue.value).toBe(true);

    // Re-render the component with the updated filters
    rerender();

    // Verify that the filter tags container is now in the document
    const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
    expect(filterTags).toBeInTheDocument();

    // Verify the filter tag content
    verifyFilterTag(
      sampleFilterColumns?.[3]?.label!,
      EFilterBooleanCondition.IS,
      (sampleFilterColumns[3] as IFilterColumnBoolean).valueProps
        .displayLabels!["true"]
    );

    unmount();
  });

  it("should be able to add an object filter with enableNegativeConditions set to true", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[5]?.label!);
    selectFilterOption(5);

    const filterConditions = Array.from({ length: 2 }, (_, index) =>
      screen.getByTestId(`${FILTER_V2_TEST_IDS.filterConditionSelect}-${index}`)
    );

    // Check that each condition has the correct text content
    const conditionTexts = filterConditions.map(
      (condition) => condition.textContent
    );

    expect(conditionTexts).toEqual(expect.arrayContaining(["Is", "Is Not"]));

    expect(filterConditions).toHaveLength(2);

    // Click on the first condition (Is)
    fireEvent.click(filterConditions[0] as HTMLDivElement);

    let filterValues: HTMLDivElement[] | undefined;
    await waitFor(() => {
      filterValues = Array.from(
        {
          length: (sampleFilterColumns?.[5] as IFilterColumnObject).valueProps
            .options.length,
        },
        (_, index) =>
          screen.getByTestId(
            `${sampleFilterColumns?.[5]?.key}-multi-select-unselected-${index}`
          )
      );
    });

    // Select the first two user options
    fireEvent.click(filterValues![0] as HTMLDivElement);
    fireEvent.click(filterValues![0] as HTMLDivElement);

    // Click the apply button to add the filter
    applyFilter();

    // Verify that the filter change callback was called
    expect(onFiltersChangeMock).toHaveBeenCalled();
    const savedFilter = onFiltersChangeMock!.mock!.calls![0]![0]![0]!;

    // Verify the selected value is the first user
    expect(savedFilter.selectedValue.value).toEqual(
      expect.arrayContaining([
        (sampleFilterColumns?.[5] as IFilterColumnObject).valueProps!
          .options![0]!.id!,
        (sampleFilterColumns?.[5] as IFilterColumnObject).valueProps!
          .options![1]!.id!,
      ])
    );

    // Re-render the component with the updated filters
    rerender();

    // Verify that the filter tags container is now in the document
    const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
    expect(filterTags).toBeInTheDocument();

    // Verify the filter tag content
    verifyFilterTag(
      sampleFilterColumns?.[5]?.label!,
      EFilterObjectCondition.IS_ANY_OF,
      (sampleFilterColumns?.[5] as IFilterColumnObject).valueProps!.options![0]!
        .name!
    );

    unmount();
  });

  it("should be able to add an enum filter", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[4]?.label!);
    selectFilterOption(4);

    let filterValues: HTMLDivElement[] | undefined;
    await waitFor(() => {
      filterValues = Array.from(
        {
          length: (sampleFilterColumns?.[4] as IFilterColumnEnum).valueProps
            .options.length,
        },
        (_, index) =>
          screen.getByTestId(
            `${sampleFilterColumns?.[4]?.key}-multi-select-unselected-${index}`
          )
      );
    });

    const conditionTexts = filterValues?.map(
      (condition) => condition?.textContent
    );

    expect(conditionTexts).toEqual(
      expect.arrayContaining(["In Progress", "Success"])
    );

    expect(filterValues).toHaveLength(
      (sampleFilterColumns[4] as IFilterColumnEnum).valueProps.options.length
    );

    // Select the first enum option
    fireEvent.click(filterValues![0] as HTMLDivElement);

    // Click the apply button to add the filter
    applyFilter();

    // Verify that the filter change callback was called
    expect(onFiltersChangeMock).toHaveBeenCalled();
    const savedFilter = onFiltersChangeMock!.mock!.calls![0]![0]![0]!;

    // Verify the selected values include the first option
    expect(savedFilter.selectedValue.value).toEqual([
      (sampleFilterColumns[4] as IFilterColumnEnum).valueProps.options[0],
    ]);

    // Re-render the component with the updated filters
    rerender();

    // Verify that the filter tags container is now in the document
    const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
    expect(filterTags).toBeInTheDocument();

    // Verify the filter tag content
    verifyFilterTag(
      sampleFilterColumns?.[4]?.label!,
      EFilterEnumCondition.IS,
      "In Progress"
    );

    unmount();
  });

  it("should be able to add a string filter", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[0]?.label!);
    selectFilterOption(0);

    const filterValueInput = screen.getByTestId(
      `${sampleFilterColumns?.[0]?.label!.toLowerCase()}-string-input`
    ) as HTMLInputElement;

    expect(filterValueInput).toBeInTheDocument();

    // Enter a string value
    fireEvent.change(filterValueInput, { target: { value: "John" } });

    // Click the apply button to add the filter
    applyFilter();

    // Verify that the filter change callback was called
    expect(onFiltersChangeMock).toHaveBeenCalled();
    const savedFilter = onFiltersChangeMock!.mock!.calls![0]![0]![0]!;

    // Verify the selected value
    expect(savedFilter.selectedValue.value).toBe("John");

    // Re-render the component with the updated filters
    rerender();

    // Verify that the filter tags container is now in the document
    const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
    expect(filterTags).toBeInTheDocument();

    // Verify the filter tag content
    verifyFilterTag(
      sampleFilterColumns?.[0]?.label!,
      EFilterStringCondition.CONTAINS,
      "John"
    );

    unmount();
  });

  // it("should be able to add a custom filter", async () => {
  //   const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

  //   openFilterPopover();
  //   searchForFilterOption(sampleFilterColumns?.[6]?.label!);
  //   selectFilterOption(6);

  //   const filterConditions = Array.from(
  //     {
  //       length: (sampleFilterColumns[6] as IFilterColumnCustom).conditionProps
  //         .length,
  //     },
  //     (_, index) =>
  //       screen.getByTestId(
  //         `${FILTER_V2_TEST_IDS.filterConditionSelect}-${index}`
  //       )
  //   );

  //   const conditionTexts = filterConditions.map(
  //     (condition) => condition.textContent
  //   );

  //   expect(conditionTexts).toEqual(
  //     expect.arrayContaining(
  //       (sampleFilterColumns[6] as IFilterColumnCustom).conditionProps.map(
  //         (fc) => fc.label
  //       )
  //     )
  //   );

  //   expect(filterConditions).toHaveLength(
  //     (sampleFilterColumns[6] as IFilterColumnCustom).conditionProps.length
  //   );

  //   // Click on the first condition (Contains)
  //   fireEvent.click(filterConditions[0]);

  //   // Enter a string value for the email
  //   const emailInput = screen
  //     .getByTestId(`${sampleFilterColumns[6].label.toLowerCase()}-string-input`)
  //     .querySelector("input") as HTMLInputElement;

  //   fireEvent.change(emailInput, { target: { value: "test@example.com" } });

  //   // Click the apply button to add the filter
  //   applyFilter();

  //   // Verify that the filter change callback was called
  //   expect(onFiltersChangeMock).toHaveBeenCalled();
  //   const savedFilter = onFiltersChangeMock.mock.calls[0][0][0];

  //   // Verify the selected condition and value
  //   expect(savedFilter.selectedCondition).toBe(EFilterStringCondition.CONTAINS);
  //   expect(savedFilter.selectedValue.value).toBe("test@example.com");

  //   // Re-render the component with the updated filters
  //   rerender();

  //   // Verify that the filter tags container is now in the document
  //   const filterTags = screen.getByTestId(FILTER_V2_TEST_IDS.filterTags);
  //   expect(filterTags).toBeInTheDocument();

  //   // Verify the filter tag content
  //   verifyFilterTag(
  //     sampleFilterColumns[6].label,
  //     startCase(EFilterStringCondition.CONTAINS),
  //     "test@example.com"
  //   );

  //   unmount();
  // });

  it("should be able to remove a single filter by clicking its remove button", async () => {
    const { onFiltersChangeMock, rerender, unmount } = setupFilterTest();

    // Add a filter first
    openFilterPopover();
    searchForFilterOption(sampleFilterColumns?.[0]?.label!);
    selectFilterOption(0);
    const filterValueInput = screen.getByTestId(
      `${sampleFilterColumns?.[0]?.label!.toLowerCase()}-string-input`
    ) as HTMLInputElement;

    fireEvent.change(filterValueInput, { target: { value: "John" } });
    applyFilter();

    // Verify initial filter count
    expect(onFiltersChangeMock).toHaveBeenCalled();
    expect(onFiltersChangeMock!.mock!.calls![0]![0]!.length).toBe(1);

    rerender();

    // Find and click the remove button for the filter tag
    const filterTag = screen.getByTestId(`${FILTER_V2_TEST_IDS.filterTag}-0`);
    const removeButton = within(filterTag).getByTestId(
      `${FILTER_V2_TEST_IDS.filterTagRemoveButton}-0`
    );
    fireEvent.click(removeButton);

    // Verify that the filter was removed
    expect(onFiltersChangeMock).toHaveBeenCalledTimes(2);
    expect(onFiltersChangeMock!.mock!.calls![1]![0]!.length).toBe(0);

    unmount();
  });
});
