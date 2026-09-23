import { ProjectEditorPlaceholder } from "@/components/projects/project-editor-placeholder";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <ProjectEditorPlaceholder projectId={projectId} />;
}
