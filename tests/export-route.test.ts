import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/export/route";
import { MAX_EXPORT_PAYLOAD_BYTES } from "@/lib/export";
import { createProject } from "@/lib/projects";

function jsonRequest(body: unknown, headers: HeadersInit = {}) {
  return new Request("http://localhost/api/export", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/export", () => {
  it("returns a self-contained attachment for a valid edited project", async () => {
    const project = createProject("Spring Export", "project-export");
    project.content = {
      "hero-title": "A downloaded heading",
      "form-name-label": "Given name",
      "form-submit": "Start now",
    };
    project.blockOrder = ["press", ...project.blockOrder.filter((blockId) => blockId !== "press")];

    const response = await POST(jsonRequest(project));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(response.headers.get("content-disposition")).toMatch(/^attachment; filename="spring-export-\d{4}-\d{2}-\d{2}\.html"$/);
    expect(html).toContain("A downloaded heading");
    expect(html).toContain("Given name");
    expect(html).toContain("Start now");
    expect(html.indexOf('id="press"')).toBeLessThan(html.indexOf('id="hero"'));
    expect(html).toContain("<style>");
    expect(html).not.toMatch(/<link\b|<script\b|<\?php|send\.php|form-kit|preview-focused|data-block-id/i);
  });

  it("sanitizes the attachment filename", async () => {
    const response = await POST(jsonRequest(createProject("Résumé / Q4\r\nCampaign", "project-export")));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-disposition")).toMatch(/^attachment; filename="resume-q4-campaign-\d{4}-\d{2}-\d{2}\.html"$/);
  });

  it.each([
    ["a non-JSON request", new Request("http://localhost/api/export", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "{}" })],
    ["malformed JSON", jsonRequest("{" )],
    ["an unknown template", jsonRequest({ ...createProject("Campaign", "project-a"), templateId: "unknown" })],
    ["an overlong field", jsonRequest({ ...createProject("Campaign", "project-a"), content: { "hero-title": "a".repeat(10_001) } })],
  ])("returns 400 for %s", async (_label, request) => {
    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
  });

  it("returns 413 when Content-Length declares an over-limit payload", async () => {
    const response = await POST(jsonRequest({}, { "Content-Length": String(MAX_EXPORT_PAYLOAD_BYTES + 1) }));

    expect(response.status).toBe(413);
  });

  it("returns 413 when an unbounded stream exceeds the payload limit", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(MAX_EXPORT_PAYLOAD_BYTES + 1));
        controller.close();
      },
    });
    const request = new Request("http://localhost/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: stream,
      duplex: "half",
    } as RequestInit);

    const response = await POST(request);

    expect(response.status).toBe(413);
  });
});
