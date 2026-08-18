"use client";

import { useEffect, useState } from "react";
import { CodeWindow } from "@/components/CodeWindow";
import { IconRain } from "@/components/IconRain";
import { MeetMeModal } from "@/components/MeetMeModal";
import { useLanguage } from "@/lib/language-context";

const TAG_COLOR: Record<string, string> = {
  DEV: "var(--accent-web)",
  ENG: "var(--accent-eng)",
  DEVOPS: "var(--accent-devops)",
  AI: "var(--accent-ai)",
  DATA: "var(--accent-dataeng)",
  SEC: "var(--accent-security)",
};

const EXPERIENCE_START = new Date(2019, 7, 14);

function formatExperience(yearUnit: string) {
  const now = new Date();
  let years = now.getFullYear() - EXPERIENCE_START.getFullYear();
  let months = now.getMonth() - EXPERIENCE_START.getMonth();
  let days = now.getDate() - EXPERIENCE_START.getDate();
  let hours = now.getHours() - EXPERIENCE_START.getHours();
  let minutes = now.getMinutes() - EXPERIENCE_START.getMinutes();
  let seconds = now.getSeconds() - EXPERIENCE_START.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${years}${yearUnit} ${months}m ${days}d, ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function Hero() {
  const { t } = useLanguage();
  const [experience, setExperience] = useState(() =>
    typeof window === "undefined" ? "" : formatExperience(t.ui.experienceYearUnit),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setExperience(formatExperience(t.ui.experienceYearUnit));
    }, 1000);
    return () => clearInterval(id);
  }, [t.ui.experienceYearUnit]);

  return (
    <section id="hero" className="relative overflow-hidden border-b border-border">
      <IconRain />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {t.location}
            </p>

            <h1 className="max-w-full whitespace-nowrap font-display text-[clamp(1.875rem,12px_+_5.625vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-foreground">
              {t.handle}
              <span className="text-accent">.</span>dev
              <span className="cursor-blink text-accent" aria-hidden>
                _
              </span>
            </h1>

            <p className="mt-3 max-w-xl font-display text-xl text-foreground/80 sm:text-2xl">
              {t.fullName}
            </p>

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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MeetMeModal />
              <a
                href="#contato"
                className="rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {t.ui.talkToMe}
              </a>
            </div>

          </div>

          <div id="foco">
            <CodeWindow title="whoami.sh">
              <p className="font-mono text-[13px] sm:text-sm">
                <span className="text-muted">$</span>{" "}
                <span className="text-foreground/90">uptime --work-experience</span>
              </p>

              <ul className="mt-6">
                <li className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] sm:text-sm">
                  <span
                    className="shrink-0 font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    --work-experience
                  </span>
                  <span
                    className="flex-1 basis-64 tabular-nums text-foreground/80"
                    suppressHydrationWarning
                  >
                    {experience || "…"}
                  </span>
                </li>
              </ul>

              <p className="mt-6 font-mono text-[13px] sm:text-sm">
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
