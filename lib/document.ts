import { PROJECT_SCHEMA_VERSION, type BlockId, type Project } from "@/lib/project-schema";
import { findTemplateDefinition } from "@/lib/templates/catalog";
import { element as h, serializeHtml, text, type HtmlNode } from "@/lib/templates/html";
import type { TemplateDefinition } from "@/lib/templates/types";

export type DocumentMode = "export" | "preview";
export type CompileOptions = { mode?: DocumentMode; focusedBlockId?: BlockId };

export class ProjectDocumentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectDocumentValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalid(message: string): never {
  throw new ProjectDocumentValidationError(message);
}

function validateBlockOrder(value: unknown, template: TemplateDefinition): asserts value is BlockId[] {
  if (!Array.isArray(value) || value.length !== template.blocks.length || !value.every((id) => typeof id === "string")) invalid("Block order must contain every template block exactly once.");
  const expected = new Set(template.blocks.map((block) => block.id));
  const actual = new Set(value);
  if (actual.size !== expected.size || !value.every((id) => expected.has(id as BlockId))) invalid("Block order contains unknown, duplicate, or missing block IDs.");
}

/** Validates untrusted session or request payloads before they reach a template renderer. */
export function validateProjectDocument(value: unknown): Project {
  if (!isRecord(value)) invalid("Project document must be an object.");
  if (value.schemaVersion !== PROJECT_SCHEMA_VERSION) invalid("Unsupported project schema version.");
  const template = findTemplateDefinition(value.templateId);
  if (!template) invalid("Unknown template ID.");
  if (typeof value.id !== "string" || value.id.length === 0) invalid("Project ID is required.");
  if (typeof value.name !== "string" || value.name.trim().length === 0) invalid("Project name is required.");
  validateBlockOrder(value.blockOrder, template);
  if (!isRecord(value.content)) invalid("Project content must be an object.");
  const knownFields = new Set(template.fields.map((field) => field.id));
  for (const [fieldId, fieldValue] of Object.entries(value.content)) {
    if (!knownFields.has(fieldId)) invalid(`Unknown field ID: ${fieldId}`);
    if (typeof fieldValue !== "string") invalid(`Field ${fieldId} must be plain text.`);
  }
  return value as Project;
}

function contentValue(template: TemplateDefinition, project: Project, fieldId: string) {
  const field = template.fields.find((entry) => entry.id === fieldId);
  if (!field) invalid(`Template attempted to render undeclared field: ${fieldId}`);
  return project.content[fieldId] ?? field.defaultValue;
}

/** Template anchors are navigation within the compiled document, never outbound links. */
function validateTemplateLocalLinks(node: HtmlNode, allowedBlockIds: ReadonlySet<string>): void {
  if (node.type !== "element") return;
  if (node.tag === "a") {
    const href = node.attributes?.href;
    if (typeof href !== "string" || !href.startsWith("#") || href.length === 1 || !allowedBlockIds.has(href.slice(1))) {
      invalid(`Template link must target a declared page section: ${String(href)}`);
    }
  }
  node.children?.forEach((child) => validateTemplateLocalLinks(child, allowedBlockIds));
}

export function compileDocument(value: unknown, options: CompileOptions = {}) {
  const project = validateProjectDocument(value);
  const template = findTemplateDefinition(project.templateId);
  if (!template) invalid("Unknown template ID.");
  const focusedBlockId = options.mode === "preview" ? options.focusedBlockId : undefined;
  const context = { value: (fieldId: string) => contentValue(template, project, fieldId), previewFocusedBlockId: focusedBlockId };
  const head = h("head", {}, [
    h("meta", { charset: "utf-8" }),
    h("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
    h("title", {}, [text(`${project.name} — ${template.name}`)]),
    h("style", {}, [text(template.stylesheet)]),
  ]);
  const body = h("body", {}, [template.renderHeader(context), h("main", {}, project.blockOrder.map((blockId) => template.renderBlock(blockId, context))), template.renderFooter(context)]);
  validateTemplateLocalLinks(body, new Set(template.blocks.map((block) => block.id)));
  return `<!doctype html>${serializeHtml(h("html", { lang: "en" }, [head, body]))}`;
}
