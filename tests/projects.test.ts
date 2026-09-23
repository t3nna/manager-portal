import { describe, expect, it } from "vitest";
import { createProject, isValidProject, PROJECT_SCHEMA_VERSION, PROJECT_STORAGE_KEY, renameProject, reorderProjectBlocks, SessionProjectRepository, TRADER_3716_BLOCK_IDS, updateProjectContent } from "@/lib/projects";
import { getTemplateDefinition } from "@/lib/templates/catalog";

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
    expect(project.blockOrder).toEqual(getTemplateDefinition("trader-3716").defaultBlockOrder);
    expect(project.blockOrder).toContain("registration-form");
    expect(TRADER_3716_BLOCK_IDS).toContain("registration-form");
  });

  it("renames a valid project and rejects invalid names", () => {
    const project = createProject("Campaign", "project-a");
    expect(renameProject(project, "  Updated campaign ").name).toBe("Updated campaign");
    expect(() => renameProject(project, " ")).toThrow("1 to 80");
  });

  it("accepts only declared plain-text fields", () => {
    const project = createProject("Campaign", "project-a");
    const updated = updateProjectContent(project, "hero-title", "A new heading");
    expect(updated.content).toEqual({ "hero-title": "A new heading" });
    expect(() => updateProjectContent(project, "navigation-label", "Unsafe")) .toThrow("Unknown template field");
    expect(isValidProject({ ...project, content: { "navigation-label": "Unsafe" } })).toBe(false);
  });

  it("persists only complete template block orders", () => {
    const project = createProject("Campaign", "project-a");
    const reordered = reorderProjectBlocks(project, ["press", ...project.blockOrder.filter((blockId) => blockId !== "press")]);
    expect(reordered.blockOrder.slice(0, 2)).toEqual(["press", "hero"]);
    expect(() => reorderProjectBlocks(project, ["hero", "header", ...project.blockOrder.slice(2)])).toThrow("every template block");
    expect(() => reorderProjectBlocks(project, ["hero", "hero", ...project.blockOrder.slice(2)])).toThrow("every template block");
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

  it("recovers from projects with unknown content fields or block IDs", () => {
    const storage = new MemoryStorage();
    const valid = createProject("Keep me", "project-a");
    const unknownField = { ...valid, id: "project-b", content: { "not-a-template-field": "value" } };
    const unknownBlock = { ...valid, id: "project-c", blockOrder: ["header", ...valid.blockOrder.slice(1)] };
    storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({ schemaVersion: PROJECT_SCHEMA_VERSION, projects: [valid, unknownField, unknownBlock] }));
    const result = new SessionProjectRepository(storage).hydrate();
    expect(result.projects).toEqual([valid]);
    expect(result.recovered).toBe(true);
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
