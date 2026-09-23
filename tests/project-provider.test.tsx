import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectProvider, useProjects } from "@/components/projects/project-provider";

function HydrationProbe() {
  const { hydrated } = useProjects();
  return <output>{hydrated ? "hydrated" : "loading"}</output>;
}

describe("project provider", () => {
  it("hydrates its session store after the client mounts", async () => {
    render(<ProjectProvider><HydrationProbe /></ProjectProvider>);
    expect(await screen.findByText("hydrated")).toBeTruthy();
  });
});
