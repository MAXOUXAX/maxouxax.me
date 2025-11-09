"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";

interface ProjectCardProps {
  name: string;
  description: string | null;
  visibility: string;
  lastCommitDate: string;
  fullName: string;
  owner: string;
  ownerType: string;
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

export function ProjectCard({
  name,
  description,
  visibility,
  lastCommitDate,
  fullName,
  owner,
  ownerType,
}: ProjectCardProps) {
  const formattedDate = formatRelativeTime(lastCommitDate);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/projects/${fullName}`}>
          <Card className="transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
                <Badge variant={visibility === "public" ? "default" : "secondary"}>
                  {visibility}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 min-h-10">
                {description || "No description available"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                {ownerType === "Organization" && (
                  <Badge variant="outline" className="text-xs">
                    {owner}
                  </Badge>
                )}
                <span className="text-xs">Updated {formattedDate}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{fullName}</h4>
          <p className="text-sm text-muted-foreground">
            {description || "No description available"}
          </p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Last updated {formattedDate}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
