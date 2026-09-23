import { expect, test } from "@playwright/test";

async function readDownload(download: import("@playwright/test").Download) {
  const stream = await download.createReadStream();
  if (!stream) throw new Error("Expected the export download to have a readable stream.");
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

test("edits, reorders, and restores a session project", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill("Slice five campaign");
  await page.getByRole("button", { name: "Create project" }).click();

  await expect(page.getByRole("heading", { name: "Project editor" })).toBeVisible();
  await page.getByRole("button", { name: "Hero", exact: true }).click();
  await page.getByLabel("Heading").fill("A keyboard-ready heading");
  await page.getByLabel("Description").fill("A live preview paragraph.");

  const preview = page.frameLocator('iframe[title="Template preview"]');
  await expect(preview.locator("h1")).toHaveText("A keyboard-ready heading");
  await expect(preview.locator(".hero")).toHaveClass(/preview-focused/);

  await page.getByRole("button", { name: "Registration form", exact: true }).click();
  await page.getByLabel("Name label", { exact: true }).fill("Given name");
  await page.getByLabel("Surname label", { exact: true }).fill("Family name");
  await page.getByLabel("Email label", { exact: true }).fill("Work email");
  await page.getByLabel("Phone label", { exact: true }).fill("Mobile number");
  await page.getByLabel("Button label", { exact: true }).fill("Start now");
  await expect(preview.getByLabel("Visual-only registration form").getByRole("button", { name: "Start now" })).toBeDisabled();

  await page.getByRole("button", { name: "Move Featured publications down" }).click();
  await expect(preview.locator("main > section").nth(2)).toHaveAttribute("id", "experts");

  const heroHandle = page.getByRole("button", { name: "Drag Hero" });
  const finalHandle = page.getByRole("button", { name: "Drag Final call to action" });
  const heroBox = await heroHandle.boundingBox();
  const finalBox = await finalHandle.boundingBox();
  if (!heroBox || !finalBox) throw new Error("Sortable block handles must be visible.");
  await page.mouse.move(heroBox.x + heroBox.width / 2, heroBox.y + heroBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(heroBox.x + heroBox.width / 2 + 12, heroBox.y + heroBox.height / 2 + 12);
  await page.mouse.move(finalBox.x + finalBox.width / 2, finalBox.y + finalBox.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(preview.locator("main > section").last()).toHaveAttribute("id", "hero");

  await page.reload();
  await page.getByRole("button", { name: "Hero", exact: true }).click();
  await expect(page.getByLabel("Heading")).toHaveValue("A keyboard-ready heading");
  await expect(page.frameLocator('iframe[title="Template preview"]').locator("main > section").last()).toHaveAttribute("id", "hero");
});

test("exports the edited document as an HTML download", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.sessionStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill("Download campaign");
  await page.getByRole("button", { name: "Create project" }).click();

  await page.getByRole("button", { name: "Hero", exact: true }).click();
  await page.getByLabel("Heading").fill("Download-ready heading");
  await page.getByRole("button", { name: "Registration form", exact: true }).click();
  await page.getByLabel("Button label", { exact: true }).fill("Get my guide");
  await page.getByRole("button", { name: "Move Featured publications up" }).click();
  await page.getByRole("button", { name: "Move Featured publications up" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export HTML" }).click();
  const download = await downloadPromise;
  const html = await readDownload(download);

  expect(download.suggestedFilename()).toMatch(/^download-campaign-\d{4}-\d{2}-\d{2}\.html$/);
  expect(html).toContain("Download-ready heading");
  expect(html).toContain("Get my guide");
  expect(html.indexOf('id="press"')).toBeLessThan(html.indexOf('id="hero"'));
  expect(html).toContain("<style>");
  expect(html).not.toMatch(/<link\b|<script\b|<\?php|send\.php|form-kit|preview-focused|data-block-id/i);
  await expect(page.getByText(/^Download started:/)).toBeVisible();
});
