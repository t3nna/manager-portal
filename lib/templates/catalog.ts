import { PROJECT_TEMPLATE_ID, type TemplateId } from "@/lib/project-schema";
import { trader3716Template } from "@/lib/templates/trader-3716";
import type { TemplateDefinition } from "@/lib/templates/types";

export const TEMPLATE_DEFINITIONS: readonly TemplateDefinition[] = [trader3716Template];

export function getTemplateDefinition(templateId: TemplateId): TemplateDefinition {
  const template = TEMPLATE_DEFINITIONS.find((entry) => entry.id === templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return template;
}

export function findTemplateDefinition(templateId: unknown): TemplateDefinition | undefined {
  return typeof templateId === "string" && templateId === PROJECT_TEMPLATE_ID ? trader3716Template : undefined;
}
