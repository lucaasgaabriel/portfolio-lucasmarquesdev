import type { ComponentType } from "react";
import { stackCategories } from "@/data/profile";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
};

function CodeIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg {...iconProps}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg {...iconProps}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg {...iconProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function GitBranchIcon() {
  return (
    <svg {...iconProps}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg {...iconProps}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

function SmartphoneIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

const CATEGORY_META: Record<string, { color: string; Icon: ComponentType }> = {
  languages: { color: "var(--accent-lang)", Icon: CodeIcon },
  dev: { color: "var(--accent-web)", Icon: LayersIcon },
  engineering: { color: "var(--accent-eng)", Icon: BoxIcon },
  cloud: { color: "var(--accent-cloud)", Icon: CloudIcon },
  devops: { color: "var(--accent-devops)", Icon: GitBranchIcon },
  security: { color: "var(--accent-security)", Icon: ShieldIcon },
  database: { color: "var(--accent-database)", Icon: DatabaseIcon },
  data: { color: "var(--accent-dataeng)", Icon: BarChartIcon },
  ai: { color: "var(--accent-ai)", Icon: CpuIcon },
  mobile: { color: "var(--accent-mobile)", Icon: SmartphoneIcon },
};

export function StackSection() {
  return (
    <section id="stacks" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mb-12 max-w-lg">
          <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
            Stacks
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Da primeira linha de código à produção em escala — o que sustenta
            o que projeto e entrego de ponta a ponta, com segurança em cada
            camada.
          </p>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stackCategories.map((category, index) => {
            const { color, Icon } = CATEGORY_META[category.id];
            const isLastOrphan =
              index === stackCategories.length - 1 &&
              stackCategories.length % 3 === 1;
            return (
              <div
                key={category.id}
                className={
                  "rounded-md border border-border bg-surface/50 p-6" +
                  (isLastOrphan ? " lg:col-start-2" : "")
                }
                style={{ borderTopColor: color, borderTopWidth: "2px" }}
              >
                <div className="mb-4 flex items-center gap-2.5" style={{ color }}>
                  <Icon />
                  <h3 className="font-mono text-xs uppercase tracking-[0.1em]">
                    {category.label}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {category.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-border bg-background/40 px-3 py-2 text-center font-mono text-xs text-foreground/85 transition-colors hover:border-accent"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
