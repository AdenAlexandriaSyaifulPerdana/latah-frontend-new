import { getStatusMeta } from "../../lib/constants";
import { cn } from "../../lib/utils";

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}