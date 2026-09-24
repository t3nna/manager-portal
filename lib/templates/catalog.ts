import type { TemplateId } from "@/lib/project-schema";
import { article2975Template } from "@/lib/templates/article-2975";
import { article3035Template } from "@/lib/templates/article-3035";
import { trader3716Template } from "@/lib/templates/trader-3716";
import type { TemplateDefinition } from "@/lib/templates/types";

export const TEMPLATE_DEFINITIONS: readonly TemplateDefinition[] = [trader3716Template, article3035Template, article2975Template];

export function getTemplateDefinition(templateId: TemplateId): TemplateDefinition {
  const template = TEMPLATE_DEFINITIONS.find((entry) => entry.id === templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return template;
}

export function findTemplateDefinition(templateId: unknown): TemplateDefinition | undefined {
  return typeof templateId === "string" ? TEMPLATE_DEFINITIONS.find((entry) => entry.id === templateId) : undefined;
}
