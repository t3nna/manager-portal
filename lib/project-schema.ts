export const PROJECT_SCHEMA_VERSION = 1 as const;
export const PROJECT_STORAGE_KEY = "manager-portal.projects.v1";
export const DEFAULT_TEMPLATE_ID = "trader-3716" as const;
export const TEMPLATE_IDS = ["trader-3716", "article-3035", "article-2975"] as const;

export const TRADER_3716_BLOCK_IDS = [
  "hero", "press", "experts", "testimonials-primary", "calculator", "how-it-works",
  "testimonials-secondary", "statistics", "testimonials-community", "final-cta", "registration-form",
] as const;

/** Block IDs are template-local; their exact membership is validated through the catalog. */
export type BlockId = string;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export type Project = {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  id: string;
  name: string;
  templateId: TemplateId;
  /** Explicit field overrides. Omitted fields use the template defaults. */
  content: Record<string, string>;
  blockOrder: BlockId[];
};
