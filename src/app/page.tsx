"use client";
import Link from "next/link";
import TableFilterV2 from "~/components/global/Filter/Filter";
import type { IFilter } from "~/types/filter.types";
import { useState } from "react";

export default function HomePage() {
  const [filters, setFilters] = useState<IFilter<any>[]>([]);
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
                  label: "Resolved",
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

          <div className="border-t border-slate-200 py-4">
            <p className="text-slate-500 text-center text-sm">
              Click the filter button above to start filtering your data
            </p>
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
