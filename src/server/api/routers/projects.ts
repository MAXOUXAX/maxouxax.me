import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface GitHubRepository {
  name: string;
  description: string | null;
  private: boolean;
  pushed_at: string;
  full_name: string;
  owner: {
    login: string;
    type: string;
  };
}

interface GitHubOrganization {
  login: string;
}

interface GitHubRepositoryDetails {
  name: string;
  description: string | null;
  private: boolean;
  pushed_at: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  homepage: string | null;
  topics: string[];
  default_branch: string;
  owner: {
    login: string;
    type: string;
  };
}

// Cached fetch wrapper for GitHub API calls with 1-hour revalidation
const cachedFetch = async (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    next: {
      revalidate: 3600, // 1 hour in seconds
    },
  });
};

export const projectsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    try {
      // Fetch user's personal repositories
      const userReposResponse = await cachedFetch(
        "https://api.github.com/users/MAXOUXAX/repos?per_page=100&sort=pushed",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "MAXOUXAX-Portfolio",
          },
        }
      );

      if (!userReposResponse.ok) {
        throw new Error(`GitHub API error: ${userReposResponse.status}`);
      }

      const userRepos = (await userReposResponse.json()) as GitHubRepository[];

      // Fetch user's organizations
      const orgsResponse = await cachedFetch(
        "https://api.github.com/users/MAXOUXAX/orgs",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "MAXOUXAX-Portfolio",
          },
        }
      );

      let orgRepos: GitHubRepository[] = [];
      if (orgsResponse.ok) {
        const orgs = (await orgsResponse.json()) as GitHubOrganization[];

        // Fetch repositories for each organization
        const orgRepoPromises = orgs.map(async (org) => {
          const orgReposResponse = await cachedFetch(
            `https://api.github.com/orgs/${org.login}/repos?per_page=100&sort=pushed`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "MAXOUXAX-Portfolio",
              },
            }
          );

          if (orgReposResponse.ok) {
            return (await orgReposResponse.json()) as GitHubRepository[];
          }
          return [];
        });

        const orgReposResults = await Promise.all(orgRepoPromises);
        orgRepos = orgReposResults.flat();
      }

      // Combine all repositories
      const allRepos = [...userRepos, ...orgRepos];

      // Remove duplicates and sort by last push date
      const uniqueRepos = Array.from(
        new Map(allRepos.map((repo) => [repo.full_name, repo])).values()
      ).sort(
        (a, b) =>
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );

      return uniqueRepos.map((repo) => ({
        name: repo.name,
        description: repo.description,
        visibility: repo.private ? "private" : "public",
        lastCommitDate: repo.pushed_at,
        fullName: repo.full_name,
        owner: repo.owner.login,
        ownerType: repo.owner.type,
      }));
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      throw new Error("Failed to fetch projects from GitHub");
    }
  }),

  getByRepo: publicProcedure
    .input(z.object({ owner: z.string().min(1), repo: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        // Fetch repository details
        const repoResponse = await cachedFetch(
          `https://api.github.com/repos/${input.owner}/${input.repo}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "MAXOUXAX-Portfolio",
            },
          }
        );

        if (!repoResponse.ok) {
          if (repoResponse.status === 404) {
            throw new Error("Repository not found");
          }
          throw new Error(`GitHub API error: ${repoResponse.status}`);
        }

        const repoData = (await repoResponse.json()) as GitHubRepositoryDetails;

        // Fetch README
        let readmeContent = null;
        try {
          const readmeResponse = await cachedFetch(
            `https://api.github.com/repos/${input.owner}/${input.repo}/readme`,
            {
              headers: {
                Accept: "application/vnd.github.v3.raw",
                "User-Agent": "MAXOUXAX-Portfolio",
              },
            }
          );

          if (readmeResponse.ok) {
            readmeContent = await readmeResponse.text();
          }
        } catch (error) {
          console.log("No README found for repository:", input.repo);
        }

        return {
          name: repoData.name,
          description: repoData.description,
          visibility: repoData.private ? "private" : "public",
          lastCommitDate: repoData.pushed_at,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          openIssues: repoData.open_issues_count,
          url: repoData.html_url,
          homepage: repoData.homepage,
          topics: repoData.topics,
          defaultBranch: repoData.default_branch,
          readme: readmeContent,
          owner: repoData.owner.login,
          ownerType: repoData.owner.type,
        };
      } catch (error) {
        console.error("Error fetching GitHub repository details:", error);
        if (error instanceof Error && error.message === "Repository not found") {
          throw error;
        }
        throw new Error("Failed to fetch project details from GitHub");
      }
    }),
});
