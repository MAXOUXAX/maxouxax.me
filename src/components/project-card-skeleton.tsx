import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-2 min-h-10">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
