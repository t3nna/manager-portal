"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilePlus2, FolderOpen, Info, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEMPLATE_CATALOG } from "@/lib/projects";
import { useProjects } from "./project-provider";

function SessionNotice({ persistenceWarning, recoveredSession }: { persistenceWarning: boolean; recoveredSession: boolean }) {
  const message = persistenceWarning
    ? "This browser could not save your changes. Keep this tab open while you work."
    : recoveredSession
      ? "Incompatible session data was removed. Your remaining projects are available below."
      : "Projects are stored only for this browser session. They are not shared or saved permanently.";

  return <div role="status" className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-950"><Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{message}</div>;
}

export function Dashboard() {
  const router = useRouter();
  const { projects, hydrated, persistenceWarning, recoveredSession, createProject, deleteProject } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const template = TEMPLATE_CATALOG[0];

  function submitProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = projectName.trim();
    if (trimmedName.length === 0 || trimmedName.length > 80) {
      setNameError("Enter a project name between 1 and 80 characters.");
      return;
    }
    const project = createProject(trimmedName);
    setProjectName("");
    setNameError(null);
    setCreateOpen(false);
    router.push(`/projects/${project.id}`);
  }

  function closeCreateDialog(open: boolean) {
    setCreateOpen(open);
    if (!open) {
      setProjectName("");
      setNameError(null);
    }
  }

  const deletingProject = projects.find((project) => project.id === projectToDelete);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-semibold text-blue-700">Workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your projects</h1>
          <p className="text-base leading-7 text-slate-600">Create a landing page project, then continue into its editor.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={!hydrated}><FilePlus2 className="size-4" aria-hidden="true" />New project</Button>
      </section>

      <SessionNotice persistenceWarning={persistenceWarning} recoveredSession={recoveredSession} />

      {!hydrated ? (
        <section aria-live="polite" className="grid min-h-64 place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-600">Loading projects…</section>
      ) : projects.length === 0 ? (
        <section className="grid min-h-72 place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="max-w-sm space-y-4">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-700"><FolderOpen className="size-6" aria-hidden="true" /></span>
            <div className="space-y-2"><h2 className="text-lg font-semibold text-slate-950">No projects yet</h2><p className="text-sm leading-6 text-slate-600">Start with the Trader 3716 template and prepare its content in the editor.</p></div>
            <Button onClick={() => setCreateOpen(true)}><FilePlus2 className="size-4" aria-hidden="true" />Create project</Button>
          </div>
        </section>
      ) : (
        <section aria-label="Projects" className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader><CardTitle>{project.name}</CardTitle><CardDescription>{template.name} · Ready for editing</CardDescription></CardHeader>
              <CardContent className="flex-1"><p className="text-sm leading-6 text-slate-600">Your content and layout preferences are saved in this browser session.</p></CardContent>
              <CardFooter className="justify-between gap-3">
                <Button asChild variant="outline"><Link href={`/projects/${project.id}`}>Open<span className="sr-only"> {project.name}</span></Link></Button>
                <Button variant="ghost" className="text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => setProjectToDelete(project.id)}><Trash2 className="size-4" aria-hidden="true" />Delete<span className="sr-only"> {project.name}</span></Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}

      <Dialog open={createOpen} onOpenChange={closeCreateDialog}>
        <DialogContent>
          <form onSubmit={submitProject} className="space-y-5">
            <DialogHeader><DialogTitle>Create project</DialogTitle><DialogDescription>Start a session-only project from the available landing page template.</DialogDescription></DialogHeader>
            <div className="space-y-2"><Label htmlFor="project-name">Project name</Label><Input id="project-name" value={projectName} onChange={(event) => { setProjectName(event.target.value); if (nameError) setNameError(null); }} aria-describedby={nameError ? "project-name-error" : undefined} aria-invalid={Boolean(nameError)} autoFocus /></div>
            {nameError && <p id="project-name-error" role="alert" className="text-sm text-red-700">{nameError}</p>}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-950">{template.name}</p><p className="mt-1 text-sm leading-6 text-slate-600">{template.description}</p><p className="mt-3 text-xs font-medium uppercase tracking-wide text-blue-700">Selected template</p></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => closeCreateDialog(false)}>Cancel</Button><Button type="submit">Create project</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={projectToDelete !== null} onOpenChange={(open) => { if (!open) setProjectToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this project?</AlertDialogTitle><AlertDialogDescription>{deletingProject ? `“${deletingProject.name}” will be removed from this browser session and cannot be recovered.` : "This project will be removed from this browser session."}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => { if (projectToDelete) deleteProject(projectToDelete); setProjectToDelete(null); }}>Delete project</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
