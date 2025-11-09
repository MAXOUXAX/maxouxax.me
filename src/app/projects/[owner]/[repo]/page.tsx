import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { ProjectDetail } from "./project-detail";

interface ProjectPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { owner, repo } = await params;

  try {
    void api.projects.getByRepo.prefetch({ owner, repo });
  } catch (error) {
    notFound();
  }

  return (
    <HydrateClient>
      <ProjectDetail owner={owner} repo={repo} />
    </HydrateClient>
  );
}
