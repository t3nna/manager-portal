import { expect, test } from "@playwright/test";

async function createProject(page: import("@playwright/test").Page, name: string) {
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill(name);
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\//);
}

test("manages session projects from the dashboard", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.sessionStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your projects" })).toBeVisible();

  await createProject(page, "Alpha project");
  await page.getByRole("link", { name: "Back to projects" }).click();
  await createProject(page, "Beta project");
  await page.getByRole("link", { name: "Back to projects" }).click();

  await expect(page.getByRole("heading", { name: "Alpha project" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Beta project" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Alpha project" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Beta project" })).toBeVisible();
  await page.getByRole("link", { name: /Open Alpha project/ }).click();
  await expect(page.getByRole("heading", { name: "Project editor" })).toBeVisible();
});

test("shows a friendly not-found page for an invalid project id", async ({ page }) => {
  await page.goto("/projects/not-a-project");
  await expect(page.getByRole("heading", { name: "Project not found" })).toBeVisible();
});
