"use client";

import Link from "next/link";
import { ArrowLeft, FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "./project-provider";

export function ProjectEditorPlaceholder({ projectId }: { projectId: string }) {
  const { getProject, hydrated } = useProjects();

  if (!hydrated) return <section aria-live="polite" className="grid min-h-64 place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-600">Loading project…</section>;

  const project = getProject(projectId);
  if (!project) {
    return <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-blue-700">Project unavailable</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950">Project not found</h1><p className="max-w-xl leading-7 text-slate-600">This project does not exist in the current browser session. Return to your projects to create or open another one.</p><Button asChild variant="outline"><Link href="/"><ArrowLeft className="size-4" aria-hidden="true" />Back to projects</Link></Button></section>;
  }

  return <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-blue-700">{project.name}</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950">Project editor</h1><p className="max-w-xl leading-7 text-slate-600">The content editor, live preview, and block ordering controls will be added in the next implementation slice.</p><div className="flex items-center gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700"><FilePenLine className="size-4" aria-hidden="true" />Template: Trader 3716</div><Button asChild variant="outline"><Link href="/"><ArrowLeft className="size-4" aria-hidden="true" />Back to projects</Link></Button></section>;
}
