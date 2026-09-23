import Link from "next/link";
import type { ReactNode } from "react";
import { Layers3 } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 rounded-md text-slate-950 focus-visible:outline-2 focus-visible:outline-blue-600">
            <span className="grid size-9 place-items-center rounded-lg bg-slate-900 text-white"><Layers3 className="size-5" aria-hidden="true" /></span>
            <span className="text-sm font-semibold tracking-tight">Manager Portal</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>
    </div>
  );
}
