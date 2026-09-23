import type { BlockId, TemplateId } from "@/lib/project-schema";
import type { HtmlNode } from "@/lib/templates/html";

export type FieldKind = "input" | "textarea";

export type FieldDefinition = {
  id: string;
  blockId: BlockId;
  label: string;
  kind: FieldKind;
  defaultValue: string;
};

export type BlockDefinition = {
  id: BlockId;
  label: string;
  movable: true;
};

export type TemplateRenderContext = {
  value: (fieldId: string) => string;
  documentMode: "export" | "preview";
  previewFocusedBlockId?: BlockId;
};

export type TemplateDefinition = {
  id: TemplateId;
  name: string;
  description: string;
  blocks: readonly BlockDefinition[];
  defaultBlockOrder: readonly BlockId[];
  fields: readonly FieldDefinition[];
  stylesheet: string;
  previewStylesheet?: string;
  renderHeader: (context: TemplateRenderContext) => HtmlNode;
  renderBlock: (blockId: BlockId, context: TemplateRenderContext) => HtmlNode;
  renderFooter: (context: TemplateRenderContext) => HtmlNode;
};
