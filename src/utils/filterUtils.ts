import {
  EFilterBooleanCondition,
  EFilterDateCondition,
  EFilterEnumCondition,
  EFilterNumberCondition,
  EFilterObjectCondition,
  EFilterStringCondition,
  type IFilterColumnCustomFilterCondition,
  type IFilterConditionDataType,
} from "~/types/filter.types";
import { generateEnumOptions } from "~/types/types";

export const SHOW_FILTER_CONDITIONS_DATA_TYPES: IFilterConditionDataType[] = [
  "date",
  "custom",
  "number",
];

export const UNIQUE_BY_DEFAULT_DATA_TYPES: IFilterConditionDataType[] = [
  "async_list",
  "enum",
  "object",
  "boolean",
] as const;

export const FILTER_V2_TEST_IDS = {
  // filter options
  filterButton: "filter-popover-trigger-button",
  filterOptionsPopover: "filter-options-popover",
  filterOptionsPopoverContent: "filter-options-popover-content",
  filterOptionsSelect: "filter-options-select",
  // filter conditions
  filterConditionSelect: "filter-condition-select",
  filterConditionSelectOptions: "filter-condition-select-options",
  filterConditionBackButton: "filter-condition-back-button",
  // filter values
  filterValueStringInput: "filter-value-string-input",
  filterValueNumberInput: "filter-value-number-input",
  filterValueBooleanSelect: "filter-value-boolean-select",
  filterValuesDatePicker: "filter-values-date-picker",
  filterValuesDateRangePicker: "filter-values-date-range-picker",
  filterValuesMultiSelect: "filter-values-multi-select",
  // filter apply button
  filterApplyButton: "filter-apply-button",
  // active filters
  activeFiltersContainer: "active-filters-container",
  filterTags: "filter-tags",
  filterTag: "filter-tag",
  filterTagRemoveButton: "filter-tag-remove-button",
  filterTagSelectedCondition: "filter-tag-selected-condition",
  clearFiltersButton: "clear-filters-button",
} as const;

export const mapConditionToJsonOperator = {
  contains: "ilike",
  equals: "==",
  "not equals": "!=",
  // 'starts with': 'ilike',
  // 'ends with': 'ilike',
  // 'is empty': '',
  // 'is not empty': '',
  "is any of": "in",
  "is not any of": "not_in",
  "=": "==",
  "!=": "!=",
  ">": ">",
  ">=": ">=",
  "<": "<",
  "<=": "<=",
  is: "==",
  "is not": "!=",
  "is after": ">",
  timestamp: "==",
  "is on or after": ">=",
  "is before": "<",
  "is on or before": "<=",
  "is empty": "isnull",
};

export const mapFilterConditionToOperator = {
  //String, Object, Enum
  contains: "__ilike",
  equals: "",
  "not equals": "__neq",
  "is empty": "__isnull",
  "is not empty": "__isnull",
  "is any of": "__in",
  "is not any of": "__not_in",
  //Number
  "=": "",
  "!=": "__neq",
  ">": "__gt",
  ">=": "__gte",
  "<": "__lt",
  "<=": "__lte",
  //Date
  "is after": "__gt",
  "is on or after": "__gte",
  "is before": "__lt",
  "is on or before": "__lte",
  //Boolean
  is: "",
  "is not": "__neq",
};

const filterConditionsForString = generateEnumOptions(EFilterStringCondition);

const filterConditionsForNumber = generateEnumOptions(EFilterNumberCondition);

const filterConditionsForDate = generateEnumOptions(EFilterDateCondition);

const filterConditionsForBoolean = generateEnumOptions(EFilterBooleanCondition);

const filterConditionsForEnum = generateEnumOptions(EFilterEnumCondition);

export const filterConditionsForObject = generateEnumOptions(
  EFilterObjectCondition
);

export const getFilterConditionsFromDataType = (
  datatype: IFilterConditionDataType,
  customConditions?: IFilterColumnCustomFilterCondition[]
) => {
  switch (datatype) {
    case "string":
      return filterConditionsForString;

    case "number":
      return filterConditionsForNumber;

    case "date":
      return filterConditionsForDate;

    case "boolean":
      return filterConditionsForBoolean;

    case "custom":
      return customConditions;

    // Group similar datatypes that share the same conditions
    case "async_list":
    case "object":
      return filterConditionsForObject;
    case "enum":
      return filterConditionsForEnum;
    default:
      return [];
  }
};
