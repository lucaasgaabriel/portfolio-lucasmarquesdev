"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function MeetMeModal() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const githubUsername = t.githubHandle.replace("@", "");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        {t.ui.meetMe}
      </button>

      {open && (
        <div
          role="presentation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.ui.meetMeTitle}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-md border border-border bg-surface p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-medium text-foreground">
                {t.ui.meetMeTitle}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.ui.closeDialog}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted transition-colors hover:border-accent hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-md border border-border p-5 text-center transition-colors hover:border-accent"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-semibold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)",
                    color: "var(--accent)",
                  }}
                  aria-hidden
                >
                  LM
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-accent">
                  <LinkedInIcon />
                  LinkedIn
                </span>
                <span className="text-xs text-muted">{t.linkedinHandle}</span>
              </a>

              <a
                href={t.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-md border border-border p-5 text-center transition-colors hover:border-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://avatars.githubusercontent.com/${githubUsername}`}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-accent">
                  GitHub
                </span>
                <span className="text-xs text-muted">{t.githubHandle}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
