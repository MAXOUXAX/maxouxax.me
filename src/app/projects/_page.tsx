import { ProjectsList } from "./projects-list";
import { api, HydrateClient } from "~/trpc/server";

export default async function Projects() {
  void api.projects.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Explore my personal and organization repositories
          </p>
        </div>
        <ProjectsList />
      </div>
    </HydrateClient>
  );
}
