import { CATEGORY_META } from "@/components/icons";
import { stackCategories } from "@/data/profile";

export function StackSection() {
  return (
    <section id="stacks" className="border-b border-border bg-surface">
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

        <div className="grid items-start gap-5 md:grid-cols-2">
          {stackCategories.map((category) => {
            const { color, Icon } = CATEGORY_META[category.id];
            return (
              <div
                key={category.id}
                className="rounded-md border border-border bg-background/60 p-6"
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
                      className="rounded-md border border-border bg-surface/40 px-3 py-2 text-center font-mono text-xs text-foreground/85 transition-colors hover:border-accent"
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
