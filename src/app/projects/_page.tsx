import { ProjectsList } from "./projects-list";
import { api, HydrateClient } from "~/trpc/server";

export default async function Projects() {
  void api.projects.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Explore my personal and organization repositories
          </p>
        </div>
        <ProjectsList />
      </div>
    </HydrateClient>
  );
}
