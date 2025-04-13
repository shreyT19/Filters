import { ListFilter } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="container max-w-4xl flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="text-center">
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl mb-2">
            Linear Table Filter Demo
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            A minimal implementation of Linear's powerful table filtering system
          </p>
        </div>

        <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Issues</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
              <ListFilter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="border-t border-slate-200 py-4">
            <p className="text-slate-500 text-center text-sm">
              Click the filter button above to start filtering your data
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Link
            href="https://linear.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Linear Website
          </Link>
        </div>
      </div>
    </main>
  );
}
