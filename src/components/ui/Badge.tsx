import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
