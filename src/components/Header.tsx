import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { content } from "@/data/content";

const profile = content.pt;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto grid h-14 max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <a
          href="#"
          className="flex items-center gap-2 justify-self-start font-mono text-sm tracking-tight text-foreground"
        >
          <span className="font-display font-semibold text-foreground">
            <span className="text-accent">{"<"}</span>
            LM
            <span className="text-accent">{"/>"}</span>
          </span>
          <span>
            {profile.handle}
            <span className="text-accent">.</span>dev
            <span className="cursor-blink text-accent" aria-hidden>
              _
            </span>
          </span>
        </a>

        <NavLinks />

        <div className="flex items-center gap-2 justify-self-end">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
