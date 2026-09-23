import { ProjectEditor } from "@/components/projects/project-editor";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectEditor projectId={projectId} />;
}
