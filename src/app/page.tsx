"use client";
import Link from "next/link";
import TableFilterV2 from "~/components/global/Filter/Filter";
import type { IFilter } from "~/types/filter.types";
import { useState, useMemo } from "react";

// Mock data type definition
type Issue = {
  id: string;
  customer: string;
  isResolved: boolean;
  issueNumber: number;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
};

// Mock data
const mockIssues: Issue[] = [
  {
    id: "1",
    customer: "Acme Corp",
    isResolved: true,
    issueNumber: 1001,
    priority: "High",
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    customer: "Globex Inc",
    isResolved: false,
    issueNumber: 1002,
    priority: "Medium",
    createdAt: "2024-03-14T15:30:00Z",
  },
  {
    id: "3",
    customer: "Initech",
    isResolved: true,
    issueNumber: 1003,
    priority: "Low",
    createdAt: "2024-03-13T09:15:00Z",
  },
  {
    id: "4",
    customer: "Umbrella Corp",
    isResolved: false,
    issueNumber: 1004,
    priority: "High",
    createdAt: "2024-03-12T14:45:00Z",
  },
  {
    id: "5",
    customer: "Stark Industries",
    isResolved: true,
    issueNumber: 1005,
    priority: "Medium",
    createdAt: "2024-03-11T11:20:00Z",
  },
];

export default function HomePage() {
  const [filters, setFilters] = useState<IFilter<Issue>[]>([]);

  // Filter the issues based on active filters
  const filteredIssues = useMemo(() => {
    return mockIssues.filter((issue) => {
      return filters.every((filter) => {
        if (!filter.selectedValue?.value || !filter.selectedCondition)
          return true;

        const value = issue[filter.column.key];
        const filterValue = filter.selectedValue.value;
        const condition = filter.selectedCondition;

        switch (filter.column.dataType) {
          case "string": {
            if (typeof value !== "string" || typeof filterValue !== "string")
              return false;
            const searchValue = value.toLowerCase();
            const searchFilter = filterValue.toLowerCase();

            switch (condition) {
              case "contains":
                return searchValue.includes(searchFilter);
              default:
                return true;
            }
          }

          case "boolean": {
            if (typeof value !== "boolean") return false;
            const boolValue = filterValue === "true";

            switch (condition) {
              case "is":
                return value === boolValue;
              default:
                return true;
            }
          }

          case "number": {
            if (typeof value !== "number" || typeof filterValue !== "number")
              return false;
            const numValue = Number(filterValue);

            switch (condition) {
              case "=":
                return value === numValue;
              case "!=":
                return value !== numValue;
              case ">":
                return value > numValue;
              case "<":
                return value < numValue;
              case ">=":
                return value >= numValue;
              case "<=":
                return value <= numValue;
              default:
                return true;
            }
          }

          case "enum": {
            if (typeof value !== "string" || typeof filterValue !== "string")
              return false;

            switch (condition) {
              case "is":
                return value === filterValue;
              case "is not":
                return value !== filterValue;
              case "is any of":
                return (
                  Array.isArray(filterValue) && filterValue.includes(value)
                );
              case "is not any of":
                return (
                  Array.isArray(filterValue) && !filterValue.includes(value)
                );
              default:
                return true;
            }
          }

          case "date": {
            if (typeof value !== "string" || typeof filterValue !== "string")
              return false;
            const issueDate = new Date(value);
            const filterDate = new Date(filterValue);

            switch (condition) {
              case "is":
                return issueDate.toDateString() === filterDate.toDateString();
              case "is after":
                return issueDate > filterDate;
              case "is before":
                return issueDate < filterDate;
              case "is on or after":
                return issueDate >= filterDate;
              case "is on or before":
                return issueDate <= filterDate;
              default:
                return true;
            }
          }

          default:
            return true;
        }
      });
    });
  }, [filters]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="container max-w-4xl flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="text-center w-full relative">
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl mb-2">
            Linear Filter Demo
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            A minimal implementation of Linear's powerful filtering system
          </p>
          <span className="inline-flex mt-4 items-center rounded-md bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Work in Progress
          </span>
        </div>

        <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex mb-6 flex-col gap-2">
            <h2 className="text-xl font-medium">Issues</h2>
            <TableFilterV2
              filterColumns={[
                {
                  key: "customer",
                  label: "Customer Name",
                  dataType: "string",
                },
                {
                  key: "isResolved",
                  label: "Status",
                  dataType: "boolean",
                  valueProps: {
                    displayLabels: {
                      true: "Resolved",
                      false: "Unresolved",
                    },
                  },
                },
                {
                  key: "issueNumber",
                  label: "Issue Number",
                  dataType: "number",
                },
                {
                  key: "priority",
                  label: "Priority",
                  dataType: "enum",
                  valueProps: {
                    options: ["Low", "Medium", "High"],
                  },
                },
                {
                  key: "createdAt",
                  label: "Created At",
                  dataType: "date",
                },
              ]}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <div className="border-t border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                      Issue #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-sm">{issue.customer}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            issue.isResolved
                              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                              : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                          }`}
                        >
                          {issue.isResolved ? "Resolved" : "Unresolved"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{issue.issueNumber}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            issue.priority === "High"
                              ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                              : issue.priority === "Medium"
                              ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                              : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredIssues.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-slate-500 text-sm">
                  No issues found matching your filters
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="w-full mt-12 border-t border-slate-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">Made with ❤️</div>
            {/* <div className="text-sm text-slate-500">
              Thanks to <span className="font-medium">Rati</span> for the design
              help
            </div> */}
            <div className="text-sm text-slate-500">
              Inspired by{" "}
              <Link
                href="https://linear.app"
                className="underline hover:text-slate-700"
              >
                Linear
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
