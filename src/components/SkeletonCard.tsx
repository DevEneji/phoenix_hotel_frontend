// src/components/SkeletonCard.tsx

import { Card } from "./Card";
import { Skeleton } from "./Skeleton";

export const SkeletonCard: React.FC = () => {
  return (
    <Card>
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  );
};