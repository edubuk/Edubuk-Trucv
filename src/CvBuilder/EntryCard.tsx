import { LucideIcon } from "lucide-react";
import type React from "react";

type EntryCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  includeControl?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isNew?: boolean;
};

export const EntryCard = ({
  icon: Icon,
  title,
  subtitle,
  meta,
  includeControl,
  actions,
  children,
  footer,
  isNew,
}: EntryCardProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#008888]/40 hover:shadow-md">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 md:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            {isNew && (
              <div className="mb-2 inline-flex items-center rounded-full border border-[#008888]/20 bg-[#008888]/10 px-2.5 py-1 text-xs font-semibold text-[#006666]">
                New document
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#008888]/10 text-[#006666]">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-slate-950">
                  {title}
                </h4>
                {subtitle && (
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {subtitle}
                  </p>
                )}
                {meta && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {meta}
                  </div>
                )}
              </div>
            </div>
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
        {includeControl && <div className="mt-3">{includeControl}</div>}
      </div>
      <div className="px-4 py-4 md:px-5 md:py-5">{children}</div>
      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 md:px-5">
          {footer}
        </div>
      )}
    </div>
  );
};
