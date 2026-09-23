"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, ChevronDown, ChevronUp, FilePenLine, GripVertical, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { compileDocument } from "@/lib/document";
import type { BlockId } from "@/lib/projects";
import { getTemplateDefinition } from "@/lib/templates/catalog";
import type { BlockDefinition } from "@/lib/templates/types";
import { useProjects } from "./project-provider";

type PreviewSize = "desktop" | "mobile";

function SortableBlock({ block, index, isSelected, isFirst, isLast, onSelect, onMove }: {
  block: BlockDefinition;
  index: number;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 1 : undefined };

  return (
    <li ref={setNodeRef} style={style} className={`rounded-lg border ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"} ${isDragging ? "shadow-lg" : ""}`}>
      <div className="flex items-center gap-1 p-1.5">
        <button ref={setActivatorNodeRef} type="button" aria-label={`Drag ${block.label}`} className="grid size-9 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600" {...attributes} {...listeners}>
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <button type="button" aria-label={block.label} onClick={onSelect} className="min-w-0 flex-1 rounded-md px-2 py-2 text-left text-sm font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600">
          <span className="block truncate">{block.label}</span>
          <span className="sr-only">, position {index + 1}</span>
        </button>
        <div className="flex shrink-0">
          <Button type="button" variant="ghost" size="icon" aria-label={`Move ${block.label} up`} disabled={isFirst} onClick={() => onMove(-1)}><ChevronUp className="size-4" aria-hidden="true" /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label={`Move ${block.label} down`} disabled={isLast} onClick={() => onMove(1)}><ChevronDown className="size-4" aria-hidden="true" /></Button>
        </div>
      </div>
    </li>
  );
}

export function ProjectEditor({ projectId }: { projectId: string }) {
  const { getProject, hydrated, renameProject, reorderProjectBlocks, updateProjectContent } = useProjects();
  const project = getProject(projectId);
  const [selectedBlockId, setSelectedBlockId] = useState<BlockId | null>(null);
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");
  const [nameError, setNameError] = useState<string | null>(null);
  const [moveStatus, setMoveStatus] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const template = project ? getTemplateDefinition(project.templateId) : null;
  const orderedBlocks = useMemo(() => template && project
    ? project.blockOrder.map((blockId) => template.blocks.find((block) => block.id === blockId)).filter((block): block is BlockDefinition => Boolean(block && block.movable))
    : [], [project, template]);
  const activeBlockId = selectedBlockId && project?.blockOrder.includes(selectedBlockId) ? selectedBlockId : project?.blockOrder[0] ?? null;
  const selectedBlock = activeBlockId ? orderedBlocks.find((block) => block.id === activeBlockId) : undefined;
  const fields = useMemo(() => selectedBlock && template ? template.fields.filter((field) => field.blockId === selectedBlock.id) : [], [selectedBlock, template]);
  const srcDoc = useMemo(() => project ? compileDocument(project, { mode: "preview", focusedBlockId: activeBlockId ?? undefined }) : "", [activeBlockId, project]);

  if (!hydrated) return <section aria-live="polite" className="grid min-h-64 place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-600">Loading project…</section>;

  if (!project || !template) {
    return <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-blue-700">Project unavailable</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950">Project not found</h1><p className="max-w-xl leading-7 text-slate-600">This project does not exist in the current browser session. Return to your projects to create or open another one.</p><Button asChild variant="outline"><Link href="/"><ArrowLeft className="size-4" aria-hidden="true" />Back to projects</Link></Button></section>;
  }
  const currentProject = project;
  const currentTemplate = template;

  function persistOrder(nextOrder: string[], movedBlockId: string) {
    if (!reorderProjectBlocks(currentProject.id, nextOrder)) return;
    const nextIndex = nextOrder.indexOf(movedBlockId);
    const label = currentTemplate.blocks.find((block) => block.id === movedBlockId)?.label ?? "Block";
    setMoveStatus(`${label} moved to position ${nextIndex + 1} of ${nextOrder.length}.`);
    setSelectedBlockId(movedBlockId as BlockId);
  }

  function moveBlock(blockId: BlockId, direction: -1 | 1) {
    const currentIndex = currentProject.blockOrder.indexOf(blockId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= currentProject.blockOrder.length) return;
    persistOrder(arrayMove(currentProject.blockOrder, currentIndex, targetIndex), blockId);
  }

  function onDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId || activeId === overId || !currentProject.blockOrder.includes(activeId as BlockId) || !currentProject.blockOrder.includes(overId as BlockId)) return;
    const oldIndex = currentProject.blockOrder.indexOf(activeId as BlockId);
    const newIndex = currentProject.blockOrder.indexOf(overId as BlockId);
    persistOrder(arrayMove(currentProject.blockOrder, oldIndex, newIndex), activeId);
  }

  function saveProjectName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("project-name") ?? "");
    if (!renameProject(currentProject.id, name)) {
      setNameError("Enter a project name between 1 and 80 characters.");
      return;
    }
    setNameError(null);
  }

  const previewWidth = previewSize === "desktop" ? 1440 : 390;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2"><p className="text-sm font-semibold text-blue-700">{template.name}</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950">Project editor</h1><p className="max-w-2xl leading-7 text-slate-600">Edit plain text and arrange the landing-page sections. Changes stay in this browser session.</p></div>
        <Button asChild variant="outline"><Link href="/"><ArrowLeft className="size-4" aria-hidden="true" />Back to projects</Link></Button>
      </header>

      <form onSubmit={saveProjectName} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2"><Label htmlFor="editor-project-name">Project name</Label><Input key={project.name} id="editor-project-name" name="project-name" defaultValue={project.name} onChange={() => { if (nameError) setNameError(null); }} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? "editor-project-name-error" : undefined} /></div>
        <Button type="submit">Save name</Button>
        {nameError && <p id="editor-project-name-error" role="alert" className="text-sm text-red-700 sm:pb-2">{nameError}</p>}
      </form>

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.7fr)_minmax(320px,0.9fr)_minmax(0,1.8fr)]">
        <aside aria-labelledby="sections-heading" className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><h2 id="sections-heading" className="font-semibold text-slate-950">Page sections</h2><p className="mt-1 text-sm leading-6 text-slate-600">Drag a handle, use its keyboard sorting controls, or use the move buttons.</p></div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={orderedBlocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
              <ol className="space-y-2">{orderedBlocks.map((block, index) => <SortableBlock key={block.id} block={block} index={index} isSelected={activeBlockId === block.id} isFirst={index === 0} isLast={index === orderedBlocks.length - 1} onSelect={() => setSelectedBlockId(block.id)} onMove={(direction) => moveBlock(block.id, direction)} />)}</ol>
            </SortableContext>
          </DndContext>
          <p aria-live="polite" className="sr-only">{moveStatus}</p>
        </aside>

        <aside aria-labelledby="fields-heading" className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div><p className="text-sm font-semibold text-blue-700">Selected section</p><h2 id="fields-heading" className="mt-1 text-xl font-semibold text-slate-950">{selectedBlock?.label ?? "Choose a section"}</h2></div>
          {selectedBlock ? <div className="space-y-4">{fields.map((field) => {
            const value = project.content[field.id] ?? field.defaultValue;
            return <div key={field.id} className="space-y-2"><Label htmlFor={`field-${field.id}`}>{field.label}</Label>{field.kind === "textarea" ? <Textarea id={`field-${field.id}`} value={value} onChange={(event) => updateProjectContent(project.id, field.id, event.target.value)} /> : <Input id={`field-${field.id}`} value={value} onChange={(event) => updateProjectContent(project.id, field.id, event.target.value)} />}</div>;
          })}</div> : <p className="text-sm text-slate-600">Choose a page section to edit its text.</p>}
          {selectedBlock?.id === "registration-form" && <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">The registration form is visual only. It is disabled in the preview and does not submit or store visitor details.</div>}
        </aside>

        <section aria-labelledby="preview-heading" className="min-w-0 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 id="preview-heading" className="font-semibold text-slate-950">Live preview</h2><p className="mt-1 text-sm text-slate-600">The blue outline marks the section selected for editing.</p></div><div className="flex rounded-lg border border-slate-300 p-1" aria-label="Preview size"><Button type="button" variant={previewSize === "desktop" ? "default" : "ghost"} size="sm" aria-pressed={previewSize === "desktop"} onClick={() => setPreviewSize("desktop")}><Monitor className="size-4" aria-hidden="true" />Desktop</Button><Button type="button" variant={previewSize === "mobile" ? "default" : "ghost"} size="sm" aria-pressed={previewSize === "mobile"} onClick={() => setPreviewSize("mobile")}><Smartphone className="size-4" aria-hidden="true" />Mobile</Button></div></div>
          <div className="overflow-auto rounded-lg border border-slate-300 bg-slate-100 p-3"><iframe title="Template preview" data-preview-size={previewSize} sandbox="" srcDoc={srcDoc} style={{ width: previewWidth, minWidth: previewWidth }} className="h-[720px] border-0 bg-white" /></div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><FilePenLine className="size-4" aria-hidden="true" />{previewSize === "desktop" ? "1440px desktop preview" : "390px mobile preview"}</div>
        </section>
      </div>
    </section>
  );
}
