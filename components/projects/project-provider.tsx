"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createProject, renameProject as renameStoredProject, reorderProjectBlocks as reorderStoredProjectBlocks, type Project, SessionProjectRepository, type TemplateId, updateProjectContent as updateStoredProjectContent } from "@/lib/projects";

type ProjectContextValue = {
  projects: Project[];
  hydrated: boolean;
  persistenceWarning: boolean;
  recoveredSession: boolean;
  createProject: (name: string, templateId: TemplateId) => Project;
  renameProject: (id: string, name: string) => boolean;
  updateProjectContent: (id: string, fieldId: string, value: string) => boolean;
  reorderProjectBlocks: (id: string, blockOrder: readonly string[]) => boolean;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
};

type StoreSnapshot = Pick<ProjectContextValue, "projects" | "hydrated" | "persistenceWarning" | "recoveredSession">;

const serverSnapshot: StoreSnapshot = { projects: [], hydrated: false, persistenceWarning: false, recoveredSession: false };
const ProjectContext = createContext<ProjectContextValue | null>(null);

class ProjectStore {
  private readonly listeners = new Set<() => void>();
  private repository: SessionProjectRepository | null = null;
  private snapshot: StoreSnapshot | null = null;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  hydrateClient() {
    this.getSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  getSnapshot = () => {
    if (this.snapshot) return this.snapshot;
    if (typeof window === "undefined") return serverSnapshot;

    this.repository = new SessionProjectRepository(window.sessionStorage);
    const result = this.repository.hydrate();
    this.snapshot = { projects: result.projects, hydrated: true, persistenceWarning: !result.persisted, recoveredSession: result.recovered };
    return this.snapshot;
  };

  update(projects: Project[]) {
    const current = this.getSnapshot();
    const persisted = this.repository?.persist(projects) ?? false;
    this.snapshot = { ...current, projects, persistenceWarning: current.persistenceWarning || !persisted };
    this.listeners.forEach((listener) => listener());
  }
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new ProjectStore());
  const [snapshot, setSnapshot] = useState<StoreSnapshot>(serverSnapshot);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      queueMicrotask(() => setSnapshot(store.getSnapshot()));
    });
    queueMicrotask(() => {
      store.hydrateClient();
      setSnapshot(store.getSnapshot());
    });
    return unsubscribe;
  }, [store]);

  const handleCreateProject = useCallback((name: string, templateId: TemplateId) => {
    const project = createProject(name, crypto.randomUUID(), templateId);
    store.update([...store.getSnapshot().projects, project]);
    return project;
  }, [store]);

  const renameProject = useCallback((id: string, name: string) => {
    const existingProject = store.getSnapshot().projects.find((project) => project.id === id);
    if (!existingProject) return false;
    try {
      const renamedProject = renameStoredProject(existingProject, name);
      store.update(store.getSnapshot().projects.map((project) => project.id === id ? renamedProject : project));
      return true;
    } catch {
      return false;
    }
  }, [store]);

  const updateProjectContent = useCallback((id: string, fieldId: string, value: string) => {
    const existingProject = store.getSnapshot().projects.find((project) => project.id === id);
    if (!existingProject) return false;
    try {
      const updatedProject = updateStoredProjectContent(existingProject, fieldId, value);
      store.update(store.getSnapshot().projects.map((project) => project.id === id ? updatedProject : project));
      return true;
    } catch {
      return false;
    }
  }, [store]);

  const reorderProjectBlocks = useCallback((id: string, blockOrder: readonly string[]) => {
    const existingProject = store.getSnapshot().projects.find((project) => project.id === id);
    if (!existingProject) return false;
    try {
      const updatedProject = reorderStoredProjectBlocks(existingProject, blockOrder);
      store.update(store.getSnapshot().projects.map((project) => project.id === id ? updatedProject : project));
      return true;
    } catch {
      return false;
    }
  }, [store]);

  const deleteProject = useCallback((id: string) => {
    store.update(store.getSnapshot().projects.filter((project) => project.id !== id));
  }, [store]);

  const getProject = useCallback((id: string) => store.getSnapshot().projects.find((project) => project.id === id), [store]);
  const value = useMemo(() => ({ ...snapshot, createProject: handleCreateProject, renameProject, updateProjectContent, reorderProjectBlocks, deleteProject, getProject }), [deleteProject, getProject, handleCreateProject, renameProject, reorderProjectBlocks, snapshot, updateProjectContent]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used inside ProjectProvider.");
  return context;
}
