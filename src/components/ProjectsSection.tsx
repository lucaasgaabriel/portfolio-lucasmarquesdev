import { CodeWindow } from "@/components/CodeWindow";
import { projects } from "@/data/profile";

export function ProjectsSection() {
  return (
    <section id="projetos" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mb-12 max-w-lg">
          <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
            Projetos & impacto
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Um recorte do que construí — não só a stack, mas o que ela
            resolveu.
          </p>
        </div>

        <CodeWindow title="git show --stat">
          <ul className="space-y-9">
            {projects.map((project) => (
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
                  <span className="font-medium text-accent">Impact:</span>{" "}
                  {project.impact}
                </p>

                <p className="mt-3 border-t border-border/60 pt-3 text-[11px] text-muted/70 sm:text-xs">
                  {project.stack.length} files changed ·{" "}
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
