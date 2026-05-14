import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <section className="rounded-[2rem] bg-[#0B2D4D] px-6 py-12 text-white md:px-10 md:py-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#F5C451]">
            {eyebrow}
          </p>

          <h1 className="mt-4 font-serif text-4xl font-black leading-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            {description}
          </p>
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}