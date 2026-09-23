import { compileDocument, validateProjectDocument } from "@/lib/document";
import { assertExportFieldLengths, createExportFilename, MAX_EXPORT_PAYLOAD_BYTES } from "@/lib/export";

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function isJsonRequest(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === "application/json";
}

async function readBoundedBody(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_EXPORT_PAYLOAD_BYTES) {
    throw new RangeError("Export payload is too large.");
  }

  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > MAX_EXPORT_PAYLOAD_BYTES) {
        await reader.cancel();
        throw new RangeError("Export payload is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export async function POST(request: Request) {
  if (!isJsonRequest(request)) return errorResponse("Export requests must use application/json.");

  let value: unknown;
  try {
    value = JSON.parse(await readBoundedBody(request));
  } catch (error) {
    if (error instanceof RangeError) return errorResponse("Export payload exceeds 256 KB.", 413);
    return errorResponse("Export request body must contain valid JSON.");
  }

  try {
    assertExportFieldLengths(value);
    const project = validateProjectDocument(value);
    const html = compileDocument(project, { mode: "export" });
    const filename = createExportFilename(project.name);
    return new Response(html, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    if (error instanceof Error) return errorResponse(error.message);
    return errorResponse("Project document is invalid.");
  }
}
