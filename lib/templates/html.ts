/** A deliberately tiny document AST. Dynamic values can only enter as text nodes. */
export type HtmlTextNode = { type: "text"; value: string };
export type HtmlElementNode = {
  type: "element";
  tag: string;
  attributes?: Record<string, string | number | boolean | undefined>;
  children?: HtmlNode[];
};
export type HtmlNode = HtmlTextNode | HtmlElementNode;

export const text = (value: string): HtmlTextNode => ({ type: "text", value });
export const element = (
  tag: string,
  attributes: HtmlElementNode["attributes"] = {},
  children: HtmlNode[] = [],
): HtmlElementNode => ({ type: "element", tag, attributes, children });

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

const voidTags = new Set(["meta", "link", "input", "img", "br", "hr"]);

export function serializeHtml(node: HtmlNode): string {
  if (node.type === "text") return escapeHtml(node.value);
  const attributes = Object.entries(node.attributes ?? {}).flatMap(([name, value]) => {
    if (value === undefined || value === false) return [];
    if (value === true) return [name];
    return [`${name}="${escapeHtml(String(value))}"`];
  }).join(" ");
  const opening = `<${node.tag}${attributes ? ` ${attributes}` : ""}>`;
  if (voidTags.has(node.tag)) return opening;
  return `${opening}${(node.children ?? []).map(serializeHtml).join("")}</${node.tag}>`;
}
