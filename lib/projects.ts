import { getTemplateDefinition } from "@/lib/templates/catalog";
import {
  PROJECT_SCHEMA_VERSION,
  PROJECT_STORAGE_KEY,
  PROJECT_TEMPLATE_ID,
  TRADER_3716_BLOCK_IDS,
  type BlockId,
  type Project,
  type TemplateId,
} from "@/lib/project-schema";

export {
  PROJECT_SCHEMA_VERSION,
  PROJECT_STORAGE_KEY,
  PROJECT_TEMPLATE_ID,
  TRADER_3716_BLOCK_IDS,
  type BlockId,
  type Project,
  type TemplateId,
};

export type TemplateCatalogEntry = {
  id: TemplateId;
  name: string;
  description: string;
  defaultBlockOrder: readonly BlockId[];
};

export const TEMPLATE_CATALOG: readonly TemplateCatalogEntry[] = [{
  id: PROJECT_TEMPLATE_ID,
  name: "Trader 3716",
  description: "A long-form digital wealth landing page.",
  defaultBlockOrder: getTemplateDefinition(PROJECT_TEMPLATE_ID).defaultBlockOrder,
}];

type StoredProjects = { schemaVersion: typeof PROJECT_SCHEMA_VERSION; projects: Project[] };
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type HydrationResult = { projects: Project[]; recovered: boolean; persisted: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeProjectName(name: string) {
  return name.trim();
}

export function isValidProjectName(name: string) {
  return name.length >= 1 && name.length <= 80 && name === normalizeProjectName(name);
}

function hasExactBlockOrder(value: unknown): value is BlockId[] {
  if (!Array.isArray(value) || value.length !== TRADER_3716_BLOCK_IDS.length) return false;
  const expected = new Set<string>(TRADER_3716_BLOCK_IDS);
  const actual = new Set(value);
  return actual.size === TRADER_3716_BLOCK_IDS.length && value.every((blockId) => typeof blockId === "string" && expected.has(blockId));
}

function hasStringContent(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "string");
}

export function isValidProject(value: unknown): value is Project {
  return isRecord(value) && value.schemaVersion === PROJECT_SCHEMA_VERSION && typeof value.id === "string" && value.id.length > 0 && value.id.length <= 128 && typeof value.name === "string" && isValidProjectName(value.name) && value.templateId === PROJECT_TEMPLATE_ID && hasStringContent(value.content) && hasExactBlockOrder(value.blockOrder);
}

export function createProject(name: string, id: string): Project {
  const normalizedName = normalizeProjectName(name);
  if (!isValidProjectName(normalizedName)) throw new Error("A project name must contain 1 to 80 characters.");
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id,
    name: normalizedName,
    templateId: PROJECT_TEMPLATE_ID,
    content: {},
    blockOrder: [...getTemplateDefinition(PROJECT_TEMPLATE_ID).defaultBlockOrder],
  };
}

export function renameProject(project: Project, name: string): Project {
  const normalizedName = normalizeProjectName(name);
  if (!isValidProjectName(normalizedName)) throw new Error("A project name must contain 1 to 80 characters.");
  return { ...project, name: normalizedName };
}

function isStoredProjects(value: unknown): value is StoredProjects {
  return isRecord(value) && value.schemaVersion === PROJECT_SCHEMA_VERSION && Array.isArray(value.projects);
}

export class SessionProjectRepository {
  constructor(private readonly storage: StorageLike) {}

  hydrate(): HydrationResult {
    let raw: string | null;
    try { raw = this.storage.getItem(PROJECT_STORAGE_KEY); } catch { return { projects: [], recovered: false, persisted: false }; }
    if (raw === null) return { projects: [], recovered: false, persisted: true };
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isStoredProjects(parsed)) return { projects: [], recovered: true, persisted: this.clear() };
      const seenIds = new Set<string>();
      const projects = parsed.projects.filter((project) => {
        if (!isValidProject(project) || seenIds.has(project.id)) return false;
        seenIds.add(project.id);
        return true;
      });
      const recovered = projects.length !== parsed.projects.length;
      return { projects, recovered, persisted: recovered ? this.persist(projects) : true };
    } catch {
      return { projects: [], recovered: true, persisted: this.clear() };
    }
  }

  persist(projects: Project[]) {
    const payload: StoredProjects = { schemaVersion: PROJECT_SCHEMA_VERSION, projects };
    try { this.storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(payload)); return true; } catch { return false; }
  }

  private clear() {
    try { this.storage.removeItem(PROJECT_STORAGE_KEY); return true; } catch { return false; }
  }
}
