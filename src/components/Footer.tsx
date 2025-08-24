"use client";

import * as React from "react";
import {
  ArrowUp,
  Github,
  Linkedin,
  Moon,
  Rss,
  Sun,
  Twitter,
} from "lucide-react";

type SocialLinks = {
  github?: string;
  twitter?: string;
  linkedin?: string;
  rss?: string;
};

export interface FooterProps {
  className?: string;
  year?: number;
  siteName?: string;
  tagline?: string;
  sourceUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
  rssUrl?: string;
  socials?: SocialLinks;
  showThemeToggle?: boolean;
  showBackToTop?: boolean;
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function useBackToTopVisible(threshold = 240) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return visible;
}

type ThemeMode = "light" | "dark";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined" || typeof matchMedia === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem("theme", mode);
  } catch {
    // ignore write errors
  }
}

export default function Footer({
  className,
  year = new Date().getFullYear(),
  siteName = "YourSite",
  tagline = "Crafted with care.",
  sourceUrl = "https://github.com/vercel/next.js",
  privacyUrl,
  termsUrl,
  rssUrl,
  socials,
  showThemeToggle = true,
  showBackToTop = true,
}: FooterProps) {
  const [theme, setTheme] = React.useState<ThemeMode>("dark");
  const backToTopVisible = useBackToTopVisible(260);

  React.useEffect(() => {
    const initTheme = getStoredTheme() ?? getSystemTheme();
    setTheme(initTheme);
    applyTheme(initTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const mediaListener = (e: MediaQueryListEvent) => {
      const stored = getStoredTheme();
      if (!stored) {
        const sys = e.matches ? "dark" : "light";
        setTheme(sys);
        applyTheme(sys);
      }
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", mediaListener);
    } else {
      media.addListener(mediaListener);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
        applyTheme(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", mediaListener);
      } else {
        media.removeListener(mediaListener);
      }
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = React.useCallback(() => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }, [theme]);

  const handleBackToTop = React.useCallback(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, []);

  const backToTopBtnClassVisible =
    "inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 opacity-100 translate-y-0";
  const backToTopBtnClassHidden =
    "inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 opacity-0 -translate-y-1 pointer-events-none";

  const ctrlButtonClass =
    "inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0";

  return (
    <footer
      className={
        className
          ? "bg-background border-t border-border " + className
          : "bg-background border-t border-border"
      }
      aria-label="Site footer"
    >
      <div className="container py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {year} {siteName}. {tagline}
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Built with{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer noopener"
                className="underline-offset-4 hover:underline text-foreground/90"
              >
                Next.js
              </a>{" "}
              +{" "}
              <a
                href="https://react.dev"
                target="_blank"
                rel="noreferrer noopener"
                className="underline-offset-4 hover:underline text-foreground/90"
              >
                React
              </a>{" "}
              •{" "}
              <a
                href={sourceUrl}
                target={isExternalUrl(sourceUrl) ? "_blank" : undefined}
                rel={isExternalUrl(sourceUrl) ? "noreferrer noopener" : undefined}
                className="underline-offset-4 hover:underline text-foreground/90"
              >
                Source
              </a>
            </p>
          </div>

          <nav aria-label="Footer navigation" className="justify-center sm:justify-center flex">
            <ul className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
              <li>
                {privacyUrl ? (
                  <a
                    href={privacyUrl}
                    target={isExternalUrl(privacyUrl) ? "_blank" : undefined}
                    rel={isExternalUrl(privacyUrl) ? "noreferrer noopener" : undefined}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
                  >
                    Privacy
                  </a>
                ) : (
                  <span aria-disabled="true" className="opacity-60 px-1 py-0.5">
                    Privacy
                  </span>
                )}
              </li>
              <li className="text-muted-foreground/50">•</li>
              <li>
                {termsUrl ? (
                  <a
                    href={termsUrl}
                    target={isExternalUrl(termsUrl) ? "_blank" : undefined}
                    rel={isExternalUrl(termsUrl) ? "noreferrer noopener" : undefined}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
                  >
                    Terms
                  </a>
                ) : (
                  <span aria-disabled="true" className="opacity-60 px-1 py-0.5">
                    Terms
                  </span>
                )}
              </li>
              <li className="text-muted-foreground/50">•</li>
              <li className="flex items-center gap-1.5">
                {rssUrl ? (
                  <a
                    href={rssUrl}
                    target={isExternalUrl(rssUrl) ? "_blank" : undefined}
                    rel={isExternalUrl(rssUrl) ? "noreferrer noopener" : undefined}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5 inline-flex items-center gap-1"
                  >
                    <Rss className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    RSS
                  </a>
                ) : (
                  <span aria-disabled="true" className="opacity-60 px-1 py-0.5 inline-flex items-center gap-1">
                    <Rss className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    RSS
                  </span>
                )}
              </li>
            </ul>
          </nav>

          <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2">
            {showBackToTop ? (
              <button
                type="button"
                onClick={handleBackToTop}
                title="Back to top"
                aria-label="Back to top"
                className={backToTopVisible ? backToTopBtnClassVisible : backToTopBtnClassHidden}
              >
                <ArrowUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              </button>
            ) : null}

            {showThemeToggle ? (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                aria-pressed={theme === "dark"}
                title="Toggle theme"
                className={ctrlButtonClass}
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                )}
                <span className="sr-only">Toggle theme</span>
              </button>
            ) : null}

            <div className="ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
              {socials?.github ? (
                <a
                  href={socials.github}
                  target={isExternalUrl(socials.github) ? "_blank" : undefined}
                  rel={isExternalUrl(socials.github) ? "noreferrer noopener" : undefined}
                  aria-label="GitHub"
                  className={ctrlButtonClass}
                >
                  <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                </a>
              ) : null}
              {socials?.twitter ? (
                <a
                  href={socials.twitter}
                  target={isExternalUrl(socials.twitter) ? "_blank" : undefined}
                  rel={isExternalUrl(socials.twitter) ? "noreferrer noopener" : undefined}
                  aria-label="Twitter"
                  className={ctrlButtonClass}
                >
                  <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                </a>
              ) : null}
              {socials?.linkedin ? (
                <a
                  href={socials.linkedin}
                  target={isExternalUrl(socials.linkedin) ? "_blank" : undefined}
                  rel={isExternalUrl(socials.linkedin) ? "noreferrer noopener" : undefined}
                  aria-label="LinkedIn"
                  className={ctrlButtonClass}
                >
                  <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                </a>
              ) : null}
              {socials?.rss ? (
                <a
                  href={socials.rss}
                  target={isExternalUrl(socials.rss) ? "_blank" : undefined}
                  rel={isExternalUrl(socials.rss) ? "noreferrer noopener" : undefined}
                  aria-label="RSS"
                  className={ctrlButtonClass}
                >
                  <Rss className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}