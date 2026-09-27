import { Skeleton } from "@/components/atoms/skeleton";

const placeholders = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

export default function Loading() {
  return (
    <div className="flex flex-1">
      <div className="hidden w-58 shrink-0 flex-col gap-5 border-input border-r bg-card px-4.5 py-5.5 md:flex">
        <Skeleton className="h-9.5 w-full rounded-[10px]" />
        <Skeleton className="h-9 w-full rounded-[10px]" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-5 px-4 pt-5 md:px-6">
        <Skeleton className="h-8 w-32" />
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
          {placeholders.map((key) => (
            <li
              key={key}
              className="overflow-hidden rounded-[14px] border bg-card"
            >
              <Skeleton className="aspect-2/3 w-full rounded-none bg-header" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-3 w-3/4 rounded-full bg-secondary" />
                <Skeleton className="h-2.5 w-1/2 rounded-full bg-secondary" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
