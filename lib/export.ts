export const MAX_EXPORT_PAYLOAD_BYTES = 256 * 1024;
export const MAX_EXPORT_FIELD_LENGTH = 10_000;

const MAX_EXPORT_SLUG_LENGTH = 60;

function utcDateStamp(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Produces the ASCII-only attachment name used by both the route and downloader. */
export function createExportFilename(projectName: string, date = new Date()) {
  const slug = projectName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_EXPORT_SLUG_LENGTH) || "project";

  return `${slug}-${utcDateStamp(date)}.html`;
}

export function getAttachmentFilename(contentDisposition: string | null) {
  const match = contentDisposition?.match(/\bfilename="([^"\\]+)"/i);
  return match?.[1] && /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}-\d{2}-\d{2}\.html$/.test(match[1]) ? match[1] : undefined;
}

export function assertExportFieldLengths(value: unknown) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return;
  const content = (value as Record<string, unknown>).content;
  if (typeof content !== "object" || content === null || Array.isArray(content)) return;

  for (const fieldValue of Object.values(content)) {
    if (typeof fieldValue === "string" && fieldValue.length > MAX_EXPORT_FIELD_LENGTH) {
      throw new Error(`Editable fields must not exceed ${MAX_EXPORT_FIELD_LENGTH.toLocaleString("en-US")} characters.`);
    }
  }
}
