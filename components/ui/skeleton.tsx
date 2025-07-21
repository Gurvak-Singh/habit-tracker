import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function HabitCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-20" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header Skeleton */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-20 w-32 mt-4 md:mt-0 rounded-xl" />
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>

        {/* Habits Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <HabitCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Skeleton, HabitCardSkeleton, DashboardSkeleton }
