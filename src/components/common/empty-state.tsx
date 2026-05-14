import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFF4D8] text-[#D9543F]">
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="text-xl font-black text-[#0B2D4D]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}