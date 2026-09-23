import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ProjectProvider } from "@/components/projects/project-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manager Portal",
  description: "Create and manage session-only landing page projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <ProjectProvider>
          <AppShell>{children}</AppShell>
        </ProjectProvider>
      </body>
    </html>
  );
}
