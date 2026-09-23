import { describe, expect, it } from "vitest";
import { compileDocument, ProjectDocumentValidationError, validateProjectDocument } from "@/lib/document";
import { createProject } from "@/lib/projects";
import { trader3716Template } from "@/lib/templates/trader-3716";

describe("static document compiler", () => {
  it("renders hostile field values as literal text", () => {
    const project = createProject("Security test", "project-security");
    project.content["hero-title"] = '<img src=x onerror=alert(1)>';
    const html = compileDocument(project);
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain("<img src=x onerror=alert(1)>");
  });

  it("emits one self-contained document without source runtime dependencies", () => {
    const html = compileDocument(createProject("Campaign", "project-a"));
    expect(html.match(/<!doctype html>/gi)).toHaveLength(1);
    expect(html.match(/<style>/gi)).toHaveLength(1);
    expect(html).not.toMatch(/<link\b|<script\b|<\?php|send\.php|form-kit|tracking/i);
  });

  it("allows only declared same-document section links", () => {
    const project = createProject("Campaign", "project-a");
    const html = compileDocument(project);
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]);
    const targets = new Set(project.blockOrder.map((blockId) => `#${blockId}`));

    expect(hrefs).toEqual(["#hero", "#how-it-works", "#calculator", "#statistics", "#registration-form", "#registration-form", "#registration-form"]);
    expect(hrefs.every((href) => href.startsWith("#") && href.length > 1 && targets.has(href))).toBe(true);
    expect(html).toContain('class="nav-action" href="#registration-form"');
  });

  it.each([
    ["unknown template", { ...createProject("Campaign", "project-a"), templateId: "unknown" }],
    ["unknown field", { ...createProject("Campaign", "project-a"), content: { unknown: "value" } }],
    ["duplicate block", { ...createProject("Campaign", "project-a"), blockOrder: ["hero", "hero", "press"] }],
    ["unsupported schema", { ...createProject("Campaign", "project-a"), schemaVersion: 2 }],
  ])("rejects %s", (_label, project) => {
    expect(() => validateProjectDocument(project)).toThrow(ProjectDocumentValidationError);
  });

  it("accepts Slice 2 projects with empty content overrides", () => {
    const project = createProject("Existing session project", "project-a");
    expect(project.content).toEqual({});
    expect(validateProjectDocument(project)).toEqual(project);
  });
});

describe("Trader 3716 definition", () => {
  it("declares all movable blocks and a unique field registry", () => {
    expect(trader3716Template.blocks).toHaveLength(11);
    expect(trader3716Template.blocks.map((block) => block.id)).toEqual(expect.arrayContaining(["hero", "registration-form", "final-cta"]));
    expect(trader3716Template.blocks.every((block) => block.movable)).toBe(true);
    expect(trader3716Template.defaultBlockOrder).toEqual(["hero", "registration-form", "press", "experts", "testimonials-primary", "calculator", "how-it-works", "testimonials-secondary", "statistics", "testimonials-community", "final-cta"]);
    expect(new Set(trader3716Template.fields.map((field) => field.id)).size).toBe(trader3716Template.fields.length);
    expect(new Set(trader3716Template.fields.map((field) => field.blockId))).toEqual(new Set(trader3716Template.blocks.map((block) => block.id)));
  });

  it("uses placeholders and an inert form without source behaviour", () => {
    const html = compileDocument(createProject("Campaign", "project-a"), { mode: "preview", focusedBlockId: "hero" });
    expect(html).toContain('role="img"');
    expect(html).toContain('class="hero preview-focused"');
    expect(html).toContain('aria-label="Visual-only registration form"');
    expect(html).toContain('type="button"');
    expect(html).not.toMatch(/<form[^>]+action=|<aside\b|lead-form|send\.php|form-kit/i);
  });

  it("keeps editor metadata out of exported documents", () => {
    const project = createProject("Campaign", "project-a");
    const previewHtml = compileDocument(project, { mode: "preview", focusedBlockId: "hero" });
    const exportHtml = compileDocument(project, { mode: "export", focusedBlockId: "hero" });

    expect(previewHtml).toContain('data-block-id="hero"');
    expect(previewHtml).toContain("preview-focused");
    expect(exportHtml).not.toContain("data-block-id");
    expect(exportHtml).not.toContain("preview-focused");
  });
});
