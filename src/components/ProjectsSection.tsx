"use client";

import { CodeWindow } from "@/components/CodeWindow";
import { useLanguage } from "@/lib/language-context";

export function ProjectsSection() {
  const { t } = useLanguage();

  return (
    <section id="projetos" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mb-12 max-w-lg">
          <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
            {t.ui.projectsHeading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {t.ui.projectsSubtitle}
          </p>
        </div>

        <CodeWindow title="git show --stat">
          <ul className="space-y-9">
            {t.projects.map((project) => (
              <li
                key={project.hash}
                className="font-mono text-[13px] sm:text-sm"
              >
                <p className="text-muted">
                  <span className="text-foreground/60">$</span> git show
                  --stat <span className="text-accent">{project.hash}</span>
                </p>

                <p className="mt-3 leading-relaxed text-foreground/90">
                  <span style={{ color: "var(--accent-lang)" }}>feat:</span>{" "}
                  {project.title}
                </p>
                <p className="mt-2 pl-4 leading-relaxed text-muted">
                  {project.description}
                </p>
                <p className="mt-2 pl-4 leading-relaxed text-foreground/80">
                  <span className="font-medium text-accent">{t.ui.impactLabel}</span>{" "}
                  {project.impact}
                </p>

                <p className="mt-3 border-t border-border/60 pt-3 text-[11px] text-muted/70 sm:text-xs">
                  {project.stack.length} {t.ui.filesChanged} ·{" "}
                  {project.stack.join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </CodeWindow>
      </div>
    </section>
  );
}
