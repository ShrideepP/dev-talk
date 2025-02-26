import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const PostSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-6" />
        </div>

        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
      </CardHeader>

      <CardContent>
        <Skeleton className="h-48 w-full rounded-xl" />
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
};
