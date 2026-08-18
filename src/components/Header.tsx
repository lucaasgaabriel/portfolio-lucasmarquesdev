import { MobileNav } from "@/components/MobileNav";
import { navLinks, profile } from "@/data/profile";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a
          href="#"
          className="flex items-center gap-2 font-mono text-sm tracking-tight text-foreground"
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

        <nav aria-label="Principal" className="hidden gap-8 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-sm border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent sm:inline-block"
        >
          LinkedIn
        </a>

        <MobileNav />
      </div>
    </header>
  );
}
