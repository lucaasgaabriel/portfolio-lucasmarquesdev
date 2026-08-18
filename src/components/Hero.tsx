import { CodeWindow } from "@/components/CodeWindow";
import { focusAreas, profile } from "@/data/profile";

const TAG_COLOR: Record<string, string> = {
  DEV: "var(--accent-web)",
  ENG: "var(--accent-eng)",
  IAC: "var(--accent-cloud)",
  AI: "var(--accent-ai)",
  DATA: "var(--accent-dataeng)",
  SEC: "var(--accent-security)",
};

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {profile.location}
            </p>

            <h1 className="max-w-xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              {profile.name}
            </h1>

            <svg
              className="signal-trace mt-8 h-10 w-full max-w-md"
              viewBox="0 0 600 60"
              fill="none"
              aria-hidden
            >
              <path
                d="M0,30 L70,30 C95,30 100,6 122,6 C144,6 148,54 170,54 C192,54 197,30 222,30 L600,30"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <p className="mt-6 max-w-xl text-lg text-muted">{profile.role}</p>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/85">
              {profile.bio}
            </p>

            <dl className="mt-14 grid max-w-sm grid-cols-2 gap-6 border-t border-border pt-8">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                  Experiência
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {profile.experienceYears} anos
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                  GitHub
                </dt>
                <dd className="mt-1">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline-offset-4 hover:underline"
                  >
                    @lucaasgaabriel14
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div id="foco">
            <CodeWindow title="whoami.sh">
              <p className="font-mono text-[13px] sm:text-sm">
                <span className="text-muted">$</span>{" "}
                <span className="text-foreground/90">whoami --focus</span>
              </p>

              <ul className="mt-6 space-y-4">
                {focusAreas.map((area) => (
                  <li
                    key={area.tag}
                    className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] sm:text-sm"
                  >
                    <span
                      className="w-24 shrink-0 font-medium"
                      style={{ color: TAG_COLOR[area.tag] }}
                    >
                      --{area.tag.toLowerCase()}
                    </span>
                    <span className="flex-1 basis-64 text-foreground/80">
                      {area.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CodeWindow>
          </div>
        </div>
      </div>
    </section>
  );
}
