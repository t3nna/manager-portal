"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { createProject, renameProject as renameStoredProject, type Project, SessionProjectRepository } from "@/lib/projects";

type ProjectContextValue = {
  projects: Project[];
  hydrated: boolean;
  persistenceWarning: boolean;
  recoveredSession: boolean;
  createProject: (name: string) => Project;
  renameProject: (id: string, name: string) => boolean;
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
    return () => this.listeners.delete(listener);
  };

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
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, () => serverSnapshot);

  const handleCreateProject = useCallback((name: string) => {
    const project = createProject(name, crypto.randomUUID());
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

  const deleteProject = useCallback((id: string) => {
    store.update(store.getSnapshot().projects.filter((project) => project.id !== id));
  }, [store]);

  const getProject = useCallback((id: string) => store.getSnapshot().projects.find((project) => project.id === id), [store]);
  const value = useMemo(() => ({ ...snapshot, createProject: handleCreateProject, renameProject, deleteProject, getProject }), [deleteProject, getProject, handleCreateProject, renameProject, snapshot]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used inside ProjectProvider.");
  return context;
}
