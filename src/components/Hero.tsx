"use client";

import { CodeWindow } from "@/components/CodeWindow";
import { IconRain } from "@/components/IconRain";
import { useLanguage } from "@/lib/language-context";

const TAG_COLOR: Record<string, string> = {
  DEV: "var(--accent-web)",
  ENG: "var(--accent-eng)",
  DEVOPS: "var(--accent-devops)",
  AI: "var(--accent-ai)",
  DATA: "var(--accent-dataeng)",
  SEC: "var(--accent-security)",
};

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <IconRain />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {t.location}
            </p>

            <h1 className="max-w-xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              {t.name}
            </h1>

            <div
              className="mt-8 flex w-full max-w-[19rem] items-center gap-1.5 sm:max-w-sm"
              aria-hidden
            >
              {Array.from({ length: 28 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              ))}
            </div>

            <p className="mt-6 max-w-xl text-lg text-muted">{t.role}</p>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/85">
              {t.bio}
            </p>

            <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                  {t.ui.experience}
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {t.experienceYears}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                  GitHub
                </dt>
                <dd className="mt-1">
                  <a
                    href={t.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline-offset-4 hover:underline"
                  >
                    {t.githubHandle}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">
                  LinkedIn
                </dt>
                <dd className="mt-1">
                  <a
                    href={t.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent underline-offset-4 hover:underline"
                  >
                    {t.linkedinHandle}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div id="foco">
            <CodeWindow title="whoami.sh">
              <p className="font-mono text-[13px] sm:text-sm">
                <span className="text-muted">$</span>{" "}
                <span className="text-foreground/90">{t.ui.whoamiCommand}</span>
              </p>

              <ul className="mt-6 space-y-4">
                {t.focusAreas.map((area) => (
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
