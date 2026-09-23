import { describe, expect, it } from "vitest";
import { createProject, PROJECT_SCHEMA_VERSION, PROJECT_STORAGE_KEY, renameProject, SessionProjectRepository, TRADER_3716_BLOCK_IDS } from "@/lib/projects";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

describe("session project repository", () => {
  it("creates projects with the Trader 3716 defaults", () => {
    const project = createProject("  Spring campaign  ", "project-a");
    expect(project.name).toBe("Spring campaign");
    expect(project.templateId).toBe("trader-3716");
    expect(project.content).toEqual({});
    expect(project.blockOrder).toEqual(TRADER_3716_BLOCK_IDS);
  });

  it("renames a valid project and rejects invalid names", () => {
    const project = createProject("Campaign", "project-a");
    expect(renameProject(project, "  Updated campaign ").name).toBe("Updated campaign");
    expect(() => renameProject(project, " ")).toThrow("1 to 80");
  });

  it("lists, persists, and deletes projects", () => {
    const storage = new MemoryStorage();
    const repository = new SessionProjectRepository(storage);
    const first = createProject("First", "project-a");
    const second = createProject("Second", "project-b");
    expect(repository.persist([first, second])).toBe(true);
    expect(repository.hydrate().projects).toEqual([first, second]);
    expect(repository.persist([second])).toBe(true);
    expect(repository.hydrate().projects).toEqual([second]);
  });

  it("rejects malformed entries while retaining valid projects", () => {
    const storage = new MemoryStorage();
    const valid = createProject("Keep me", "project-a");
    storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({ schemaVersion: PROJECT_SCHEMA_VERSION, projects: [valid, { ...valid, id: "project-b", name: " " }] }));
    const result = new SessionProjectRepository(storage).hydrate();
    expect(result.recovered).toBe(true);
    expect(result.projects).toEqual([valid]);
    expect(JSON.parse(storage.getItem(PROJECT_STORAGE_KEY) ?? "{}").projects).toEqual([valid]);
  });

  it("clears malformed or obsolete session data", () => {
    const storage = new MemoryStorage();
    storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({ schemaVersion: 2, projects: [] }));
    const result = new SessionProjectRepository(storage).hydrate();
    expect(result.projects).toEqual([]);
    expect(result.recovered).toBe(true);
    expect(storage.getItem(PROJECT_STORAGE_KEY)).toBeNull();
  });
});
