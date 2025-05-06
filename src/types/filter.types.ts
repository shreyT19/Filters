import { Dayjs } from "dayjs";
import type { EnumValues } from "./types";
// TODO: Fix generic types for filter columns, currently it's a bit of a mess

// // Get the type of any load function from the service keys
// export type ILoadOptionsType = ReturnType<
//   typeof serviceKeyIds
// >[keyof ReturnType<typeof serviceKeyIds>]["load"] extends (
//   ...args: any[]
// ) => infer R
//   ? R
//   : never;

// // Extract the item type from the promise array
// export type ILoadOptionsItemType = ILoadOptionsType extends Promise<
//   Array<infer T>
// >
//   ? T
//   : never;

export type IFilterConditionDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "custom"
  | "object"
  | "async_list";

type IFilterColumnBase<T> = {
  icon?: string;
  key: keyof T;
  label: string;
  dataType: IFilterConditionDataType;
  /**
   * @description The key of the filter in the query
   */
  filterKey?: string;
  /**
   * @description Specific to json filters, helps in building the json payload
   */
  isJoinTable?: boolean;
  defaultValue?: IFilterValue;
  /**
   * @description If true, only one filter of this type can be added
   * @default false
   */
  isUnique?: boolean;
};

export type IFilterColumnNumber<T> = Omit<IFilterColumnBase<T>, "dataType"> & {
  dataType: "number";
  /**
   * Transform the input value before it's used in the query
   * Example: multiply by 100 for percentage conversion
   */
  valueProps?: {
    transform?: (value: number) => number;
    /**
     * Transform the input value back to the original value
     * Example: divide by 100 for percentage conversion
     */
    reverseTransform?: (value: number) => number;
  };
};

export type IFilterColumn<T = unknown> =
  | IFilterColumnBase<T>
  | IFilterColumnCustom<T>
  | IFilterColumnAsyncList<T>
  | IFilterColumnObject<T>
  | IFilterColumnBoolean<T>
  | IFilterColumnEnum<T>
  | IFilterColumnNumber<T>
  | IFilterColumnDate<T>;

export type IFilterColumnEnum<T = unknown> = Omit<
  IFilterColumnBase<T>,
  "dataType"
> & {
  dataType: "enum";
  valueProps: {
    options: string[];
    /**
     * @description If true, negative filter conditions (like "is not") will be enabled
     * @default false
     */
    enableNegativeConditions?: boolean;
  };
};

export type IDateRangePreset = {
  label: React.ReactNode;
  value: [Dayjs, Dayjs];
};

export type IDatePreset = {
  label: React.ReactNode;
  value: Dayjs;
};

export type IFilterColumnDate<T = unknown> = Omit<
  IFilterColumnBase<T>,
  "dataType"
> & {
  dataType: "date";
  valueProps: {
    /**
     * @description If true, the date will be displayed in timestamp format
     * @default false
     */
    isTimestamp?: boolean;
    /**
     * @description The type of presets to use for the date filter
     * @default 'previous'
     */
    presetsType?: "previous" | "future";
    /**
     * @description The presets to use for the date filter
     * @default []
     */
    presets?: IDateRangePreset[] | IDatePreset[];
  };
};

export type IFilterColumnBoolean<T = unknown> = Omit<
  IFilterColumnBase<T>,
  "dataType"
> & {
  dataType: "boolean";
  valueProps: {
    displayLabels?: {
      true: string;
      false: string;
    };
  };
};

export type IFilterColumnAsyncList<T = unknown> = Omit<
  IFilterColumnBase<T>,
  "dataType"
> & {
  dataType: "async_list";
  valueProps: {
    loadOptionsOf: any;
    // loadOptionsOf: keyof ReturnType<typeof serviceKeyIds>;
    labelKey: string;
    valueKey: string;
    /**
     * @description If true, negative filter conditions (like "is not"," is not any of") will be enabled
     * @default false
     */
    enableNegativeConditions?: boolean;
  };
};

export type IFilterColumnCustomFilterCondition<T = unknown> = {
  label: string;
  value: string;
  filterColumn: Omit<IFilterColumn<T>, "key" | "label">;
};

export type IFilterColumnCustom<T = unknown> = Omit<
  IFilterColumnBase<T>,
  "dataType"
> & {
  dataType: "custom";
  conditionProps: IFilterColumnCustomFilterCondition<T>[];
};

export type IFilterColumnObject<
  T = unknown,
  Options extends readonly Record<string, any>[] = readonly Record<
    string,
    any
  >[]
> = Omit<IFilterColumnBase<T>, "dataType"> & {
  dataType: "object";
  valueProps: {
    options: Options;
    labelKey: keyof Options[number];
    valueKey: keyof Options[number];
    /**
     * @description If true, negative filter conditions (like "is not"," is not any of") will be enabled
     * @default false
     */
    enableNegativeConditions?: boolean;
  };
};

export enum EFilterStringCondition {
  CONTAINS = "contains",
}

export type IFilterStringCondition = EnumValues<typeof EFilterStringCondition>;

export enum EFilterNumberCondition {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
}

export type IFilterNumberCondition = EnumValues<typeof EFilterNumberCondition>;

export enum EFilterDateCondition {
  IS = "is",
  IS_AFTER = "is after",
  IS_ON_OR_AFTER = "is on or after",
  IS_BEFORE = "is before",
  IS_ON_OR_BEFORE = "is on or before",
}

export type IFilterDateCondition = EnumValues<typeof EFilterDateCondition>;
export enum EFilterBooleanCondition {
  IS = "is",
}

export type IFilterBooleanCondition = EnumValues<
  typeof EFilterBooleanCondition
>;
export enum EFilterEnumCondition {
  IS = "is",
  IS_NOT = "is not",
  IS_ANY_OF = "is any of",
  IS_NOT_ANY_OF = "is not any of",
}

export type IFilterEnumCondition = EnumValues<typeof EFilterEnumCondition>;
export enum EFilterObjectCondition {
  IS = "is",
  IS_NOT = "is not",
  IS_ANY_OF = "is any of",
  IS_NOT_ANY_OF = "is not any of",
}

export type IFilterValue = {
  value?: string | string[] | number | number[] | boolean;
  metaData?: Record<string, unknown> | Record<string, unknown>[] | null;
};

export type IFilterJson = {
  field: string;
  op: string;
  value: IFilterValue["value"];
};

export type IFilterObjectCondition = EnumValues<typeof EFilterObjectCondition>;
export type IFilter<T = unknown> = {
  id?: string;
  column: IFilterColumn<T>;
  dataType: IFilterConditionDataType;
  subDataType?: IFilterConditionDataType; // in case of custom filter condition
  subDataTypeMetaData?: IFilterColumnCustomFilterCondition<T>;
  selectedCondition?:
    | (T extends { dataType: "string" } ? IFilterStringCondition : never)
    | (T extends { dataType: "number" } ? IFilterNumberCondition : never)
    | (T extends { dataType: "date" } ? IFilterDateCondition : never)
    | (T extends { dataType: "boolean" } ? IFilterBooleanCondition : never)
    | (T extends { dataType: "enum" } ? IFilterEnumCondition : never)
    | (T extends { dataType: "object" | "async_list" }
        ? IFilterObjectCondition
        : never)
    | (T extends { dataType: "custom" } ? string : never)
    | string;
  selectedValue?: IFilterValue;
  isEditable?: boolean;
  isDeletable?: boolean;
};
