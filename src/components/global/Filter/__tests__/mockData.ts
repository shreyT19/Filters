import { IFilterColumn, IFilterColumnBoolean } from "~/types/filter.types";

export type SampleFilterColumn = {
  customer_name: string;
  amount: number;
  date: string;
  autoCharge: boolean;
  status: string;
  user: {
    name: string;
    id: string;
  };
  email: string;
};

// Sample filter columns for testing
export const sampleFilterColumns: IFilterColumn<SampleFilterColumn>[] = [
  {
    icon: "mail",
    label: "Customer Name",
    key: "customer_name",
    dataType: "string",
  },
  {
    icon: "mail",
    label: "Amount",
    key: "amount",
    dataType: "number",
  },
  {
    icon: "mail",
    label: "Date",
    key: "date",
    dataType: "date",
  },
  {
    icon: "mail",
    label: "Auto Charge",
    key: "autoCharge",
    dataType: "boolean",
    valueProps: {
      displayLabels: {
        true: "Is Enabled",
        false: "Is Disabled",
      },
    },
  },
  {
    icon: "mail",
    label: "Status",
    key: "status",
    dataType: "enum",
    valueProps: {
      options: ["in_progress", "success"],
    },
  },
  {
    icon: "mail",
    label: "User",
    key: "user",
    dataType: "object",
    valueProps: {
      labelKey: "name",
      valueKey: "id",
      options: [
        { name: "John Doe", id: "1" },
        { name: "Jane Doe", id: "2" },
      ],
      enableNegativeConditions: true,
    },
  },
  {
    icon: "mail",
    key: "email",
    label: "Email ID",
    dataType: "custom",
    conditionProps: [
      {
        label: "Contains",
        value: "contains",
        filterColumn: {
          dataType: "string",
        },
      },
      {
        label: "Is",
        value: "is empty",
        filterColumn: {
          dataType: "boolean",
          valueProps: {
            displayLabels: {
              true: "Empty",
              false: "Not Empty",
            },
          },
        } as IFilterColumnBoolean,
      },
    ],
  },
];
