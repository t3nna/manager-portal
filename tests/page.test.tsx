import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, expect, it } from "vitest";
import { Dashboard } from "@/components/projects/dashboard";
import { ProjectProvider } from "@/components/projects/project-provider";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("portal shell", () => {
  it("renders the dashboard heading", async () => {
    render(<ProjectProvider><Dashboard /></ProjectProvider>);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Your projects" })).not.toBeNull());
  });
});
