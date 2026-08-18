import type { ReactNode } from "react";

export function CodeWindow({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface/60">
      <div className="flex items-center gap-3 border-b border-border bg-background/50 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--error)" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--accent-security)" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--accent-lang)" }}
          />
        </div>
        <span className="font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
