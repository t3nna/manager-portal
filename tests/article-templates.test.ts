import { describe, expect, it } from "vitest";
import { compileDocument, validateProjectDocument } from "@/lib/document";
import { createProject, reorderProjectBlocks, TEMPLATE_CATALOG, updateProjectContent } from "@/lib/projects";
import { getTemplateDefinition } from "@/lib/templates/catalog";

const articleTemplateIds = ["article-3035", "article-2975"] as const;

describe("neutral editorial templates", () => {
  it("lists the existing landing template and both article templates", () => {
    expect(TEMPLATE_CATALOG.map((template) => template.id)).toEqual(["trader-3716", "article-3035", "article-2975"]);
  });

  it.each(articleTemplateIds)("creates a complete project for %s", (templateId) => {
    const project = createProject("Editorial project", `${templateId}-project`, templateId);
    const template = getTemplateDefinition(templateId);

    expect(project.templateId).toBe(templateId);
    expect(project.blockOrder).toEqual(template.defaultBlockOrder);
    expect(project.blockOrder).toContain("registration-form");
    expect(new Set(template.fields.map((field) => field.id)).size).toBe(template.fields.length);
    expect(validateProjectDocument(project)).toEqual(project);
  });

  it.each(articleTemplateIds)("rejects fields and block orders that do not belong to %s", (templateId) => {
    const project = createProject("Editorial project", `${templateId}-project`, templateId);

    expect(() => updateProjectContent(project, "hero-title", "Unexpected field")).toThrow("Unknown template field");
    expect(() => reorderProjectBlocks(project, ["header", ...project.blockOrder.slice(1)])).toThrow("every template block");
  });

  it.each(articleTemplateIds)("renders %s as a safe, self-contained document", (templateId) => {
    const project = createProject("Editorial export", `${templateId}-project`, templateId);
    project.content.headline = '<img src=x onerror=alert(1)>';
    const preview = compileDocument(project, { mode: "preview", focusedBlockId: "article-header" });
    const exported = compileDocument(project);

    expect(preview).toContain('data-block-id="article-header"');
    expect(preview).toContain("preview-focused");
    expect(exported).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(exported).toContain('aria-label="Visual-only information form"');
    expect(exported).toContain('type="button" disabled');
    expect(exported).toContain('role="img"');
    expect(exported.match(/<!doctype html>/gi)).toHaveLength(1);
    expect(exported.match(/<style>/gi)).toHaveLength(1);
    expect(exported).not.toMatch(/<link\b|<script\b|<\?php|send\.php|form-kit|jquery|tracking|countdown|cnn|globo|g1|luciano|havan|petrobras/i);
    expect(exported).not.toContain("data-block-id");
    expect(exported).not.toContain("preview-focused");
  });

  it("keeps the 3035 related-stories sidebar outside the editable field registry", () => {
    const template = getTemplateDefinition("article-3035");
    const project = createProject("Magazine", "article-3035-project", "article-3035");
    const exported = compileDocument(project);

    expect(exported).toContain('<aside class="news-aside"');
    expect(template.blocks.map((block) => block.id)).not.toContain("related-stories");
    expect(template.fields.some((field) => field.id.includes("related"))).toBe(false);
  });
});
