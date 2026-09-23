import { expect, test } from "@playwright/test";

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
