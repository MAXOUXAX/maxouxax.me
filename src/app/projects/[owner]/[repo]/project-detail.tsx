"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Progress } from "~/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProjectDetailProps {
  owner: string;
  repo: string;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1 || unit === "second") {
      return rtf.format(-interval, unit);
    }
  }

  return "just now";
}

export function ProjectDetail({ owner, repo }: ProjectDetailProps) {
  const { data: project, isLoading, error } = api.projects.getByRepo.useQuery({ owner, repo });
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Project not found</CardTitle>
            <CardDescription>
              The project you&apos;re looking for doesn&apos;t exist or is not accessible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Progress value={loadingProgress} className="w-full" />
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-32" />
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/projects?owner=${project.owner}`}>{project.owner}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <p className="text-lg text-muted-foreground">
              {project.description || "No description available"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={project.visibility === "public" ? "default" : "secondary"}>
              {project.visibility}
            </Badge>
            {project.language && (
              <Badge variant="outline">{project.language}</Badge>
            )}
            {project.ownerType === "Organization" && (
              <Badge variant="outline">{project.owner}</Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open repository on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {project.homepage && (
            <Button asChild variant="outline">
              <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => copyToClipboard(project.url, "Repository URL")}
          >
            Copy URL
          </Button>

          <Button
            variant="outline"
            onClick={() => copyToClipboard(`git clone ${project.url}.git`, "Clone command")}
          >
            Copy Clone Command
          </Button>
        </div>
      </div>

      <Separator />

      {/* Stats - Compact Display */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">⭐ Stars:</span>
          <span className="font-semibold">{project.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">🍴 Forks:</span>
          <span className="font-semibold">{project.forks.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">❗ Issues:</span>
          <span className="font-semibold">{project.openIssues.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">📅 Updated:</span>
          <span className="font-semibold">{formatRelativeTime(project.lastCommitDate)}</span>
        </div>
        {project.language && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">💻 Language:</span>
            <span className="font-semibold">{project.language}</span>
          </div>
        )}
      </div>

      {/* Topics */}
      {project.topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* README */}
      {project.readme && (
        <Card>
          <CardHeader>
            <CardTitle>README</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.readme}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
