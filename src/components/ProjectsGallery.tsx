"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Link as LinkIcon,
  Loader2,
  Search,
  Star,
  Eye,
  X,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

type ProjectKPIMetric = {
  label: string;
  value: string;
  sublabel?: string;
};

type ProjectCaseStudy = {
  challenge: string;
  approach: string;
  results: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  summary: string;
  caseStudy: ProjectCaseStudy;
  role: string;
  year: number;
  tech: string[];
  thumbnail: string;
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  impactScore?: number; // used for sorting "Most Impactful"
  kpis?: ProjectKPIMetric[];
};

export type ProjectsGalleryProps = {
  projects?: ProjectItem[];
  className?: string;
};

const sampleProjects: ProjectItem[] = [
  {
    id: "p1",
    title: "GreenCart Marketplace",
    summary: "Sustainable e-commerce platform with carbon tracking at checkout.",
    caseStudy: {
      challenge:
        "Create a high-performing marketplace experience while surfacing sustainability data without overwhelming the user.",
      approach:
        "Implemented an edge-rendered Next.js app with streaming SSR and RSC. Designed a clear, card-first UI. Added a carbon calculator microservice and progressive disclosure for sustainability data.",
      results:
        "Increased conversion by 12%, improved LCP to 1.7s, and boosted eco-choices adoption by 28%.",
    },
    role: "Lead Frontend",
    year: 2024,
    tech: ["Next.js", "TypeScript", "Tailwind", "Edge", "Postgres"],
    thumbnail:
      "https://images.unsplash.com/photo-1609527057329-cd6b3f0fbf9b?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1557825835-70d97c4aa567?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop",
    ],
    liveUrl: "https://example.com/greencart",
    repoUrl: "https://github.com/example/greencart",
    featured: true,
    impactScore: 95,
    kpis: [
      { label: "Conversion", value: "+12%" },
      { label: "LCP", value: "1.7s" },
      { label: "Eco adoption", value: "+28%" },
    ],
  },
  {
    id: "p2",
    title: "Nova Analytics",
    summary:
      "Self-serve analytics with beautiful, real-time dashboards and alerts.",
    caseStudy: {
      challenge:
        "Deliver real-time analytics with smooth charts while keeping the interface approachable for non-technical users.",
      approach:
        "Built a component-based chart library, virtualized lists, and used server actions for low-latency writes. Created a thoughtful onboarding with guided tooltips.",
      results:
        "Reduced time-to-insight by 40% and increased MAU by 21%. Support tickets for dashboards dropped by 35%.",
    },
    role: "Product Engineer",
    year: 2023,
    tech: ["Next.js", "TypeScript", "Tailwind", "WebSockets"],
    thumbnail:
      "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551281044-8d8a9b06a9b1?q=80&w=1600&auto=format&fit=crop",
    ],
    liveUrl: "https://example.com/nova",
    repoUrl: "https://github.com/example/nova",
    featured: false,
    impactScore: 88,
    kpis: [
      { label: "Time-to-insight", value: "-40%" },
      { label: "MAU", value: "+21%" },
    ],
  },
  {
    id: "p3",
    title: "Atlas Design System",
    summary: "A scalable design system powering 12 internal products.",
    caseStudy: {
      challenge:
        "Unify disparate UI across teams, reduce duplication, and improve velocity.",
      approach:
        "Developed a token-driven, accessible component library using shadcn/ui foundations with custom theming and rigorous docs.",
      results:
        "Cut UI build time by 32% and reduced accessibility issues by 60%.",
    },
    role: "Design Engineer",
    year: 2022,
    tech: ["React", "TypeScript", "Tailwind", "Storybook", "shadcn/ui"],
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534764110790-2ccc05a0f034?q=80&w=1600&auto=format&fit=crop",
    ],
    repoUrl: "https://github.com/example/atlas",
    featured: true,
    impactScore: 91,
    kpis: [
      { label: "Velocity", value: "+32%" },
      { label: "A11y issues", value: "-60%" },
    ],
  },
  {
    id: "p4",
    title: "SwiftPay",
    summary:
      "Instant payments experience with strong fraud prevention and great UX.",
    caseStudy: {
      challenge:
        "Create a friendly payments UX while maintaining strict security and reliability requirements.",
      approach:
        "Implemented optimistic UI for transfers, adaptive 2FA, and a clear status system. Built a robust activity feed with filters and exports.",
      results:
        "NPS improved by 18 points; fraud rate dropped by 23% with no impact on success rate.",
    },
    role: "Fullstack Engineer",
    year: 2024,
    tech: ["Next.js", "TypeScript", "Tailwind", "Prisma", "Postgres"],
    thumbnail:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
    ],
    liveUrl: "https://example.com/swiftpay",
    repoUrl: "https://github.com/example/swiftpay",
    featured: false,
    impactScore: 89,
    kpis: [
      { label: "NPS", value: "+18" },
      { label: "Fraud", value: "-23%" },
    ],
  },
  {
    id: "p5",
    title: "Trailblaze CMS",
    summary:
      "Headless CMS with inline editing and collaborative draft workflows.",
    caseStudy: {
      challenge:
        "Combine developer-friendly APIs with a clean editor experience usable by non-technical authors.",
      approach:
        "RSC-powered preview, CRDT-based collaboration, and a minimal toolbar UI with keyboard-first controls.",
      results:
        "Publishing lead time decreased by 45% and editorial satisfaction increased significantly.",
    },
    role: "Frontend Engineer",
    year: 2021,
    tech: ["React", "TypeScript", "Tailwind", "CRDT", "Vercel"],
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587620931284-95b58a56f8fd?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    ],
    repoUrl: "https://github.com/example/trailblaze",
    featured: false,
    impactScore: 76,
    kpis: [
      { label: "Lead time", value: "-45%" },
      { label: "Editor CSAT", value: "High" },
    ],
  },
  {
    id: "p6",
    title: "Astra Learn",
    summary:
      "Personalized learning paths with spaced repetition and rich progress.",
    caseStudy: {
      challenge:
        "Keep learners engaged and progressing with clear goals and effective retention.",
      approach:
        "Designed a motivational UI with streaks, clear milestones, and dynamic reviews based on spaced repetition.",
      results:
        "DAU increased 35% and lesson completion rose by 22%. Retention stabilized over 10 weeks.",
    },
    role: "Product Engineer",
    year: 2022,
    tech: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    thumbnail:
      "https://images.unsplash.com/photo-1551281044-8f6f0b045f62?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523246191908-8da5ee1f3906?q=80&w=1600&auto=format&fit=crop",
    ],
    liveUrl: "https://example.com/astralearn",
    featured: false,
    impactScore: 82,
    kpis: [
      { label: "DAU", value: "+35%" },
      { label: "Completion", value: "+22%" },
    ],
  },
];

type SortKey = "newest" | "impact" | "featured";

export default function ProjectsGallery({
  projects,
  className,
}: ProjectsGalleryProps) {
  const data = projects && projects.length > 0 ? projects : sampleProjects;

  // Toolbar state
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  // Modal state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ProjectItem | null>(null);
  const [slide, setSlide] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const onScroll = () => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = engine.scrollProgress.get(0);

      emblaApi.slideNodes().forEach((slideNode, index) => {
        const slideProgress = engine.scrollSnaps[index] - scrollProgress;
        const a = Math.abs(slideProgress);
        const scale = 1 - a * 0.3;
        const rotate = -slideProgress * 20;
        const translateX = -slideProgress * 100;

        slideNode.style.transform = `translateX(${translateX}%) scale(${scale}) rotate(${rotate}deg)`;
      });
    };

    emblaApi.on("scroll", onScroll);
    onScroll();

    return () => {
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    data.forEach((p) => p.tech.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tags = selectedTags;
    let arr = data.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.tech.join(" ").toLowerCase().includes(q);
      const matchesTags =
        tags.size === 0 || p.tech.some((t) => tags.has(t));
      return matchesQuery && matchesTags;
    });

    switch (sortBy) {
      case "newest":
        arr = arr.sort((a, b) => b.year - a.year);
        break;
      case "impact":
        arr = arr.sort(
          (a, b) => (b.impactScore || 0) - (a.impactScore || 0)
        );
        break;
      case "featured":
        arr = arr
          .sort((a, b) => b.year - a.year)
          .sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }
    return arr;
  }, [data, query, selectedTags, sortBy]);

  const handleOpenProject = useCallback((p: ProjectItem) => {
    setActive(p);
    setSlide(0);
    setImageLoading(true);
    setOpen(true);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

  const nextSlide = useCallback(() => {
    if (!active) return;
    setImageLoading(true);
    setSlide((s) => (s + 1) % active.images.length);
  }, [active]);

  const prevSlide = useCallback(() => {
    if (!active) return;
    setImageLoading(true);
    setSlide((s) => (s - 1 + active.images.length) % active.images.length);
  }, [active]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, nextSlide, prevSlide]);

  // Touch swipe for carousel
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (delta > threshold) {
      prevSlide();
    } else if (delta < -threshold) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  const onCopyLink = async (href?: string) => {
    try {
      const value =
        href || active?.liveUrl || active?.repoUrl || window.location.href;
      await navigator.clipboard.writeText(value || "");
      toast("Link copied");
    } catch {
      toast("Unable to copy link");
    }
  };

  const onDownloadCaseStudy = () => {
    if (!active) return;
    const content = `Case Study: ${active.title}\n\nChallenge\n${active.caseStudy.challenge}\n\nApproach\n${active.caseStudy.approach}\n\nResults\n${active.caseStudy.results}\n\nRole: ${active.role}\nYear: ${active.year}\nTech: ${active.tech.join(", ")}\n\nKPIs:\n${(active.kpis || [])
      .map((k) => `- ${k.label}: ${k.value}${k.sublabel ? ` (${k.sublabel})` : ""}`)
      .join("\n")}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.title.replace(/\s+/g, "_")}_Case_Study.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Case study downloaded");
  };

  return (
    <section
      className={["w-full", "bg-background", className].filter(Boolean).join(" ")}
      aria-label="Projects Gallery"
    >
      <div className="container py-8 sm:py-10">
        <div className="mb-4 sm:mb-6">
          <Toolbar
            query={query}
            setQuery={setQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            tags={allTags}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            clearTags={clearTags}
            total={filtered.length}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <Carousel
            setApi={setEmblaApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <CarouselContent>
              {filtered.map((p, index) => (
                <CarouselItem key={index} className="p-2">
                  <ProjectCard
                    project={p}
                    onOpen={() => handleOpenProject(p)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
        )}

        <Dialog
          open={open}
          onOpenChange={(v) => {
            if (!v) {
              setActive(null);
              setSlide(0);
            }
            setOpen(v);
          }}
        >
          <DialogContent
            className="max-w-5xl p-0 overflow-hidden bg-card border border-border data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            aria-label={active ? `Project details: ${active.title}` : "Project details"}
          >
            {active && (
              <div className="bg-card text-card-foreground">
                <DialogHeader className="px-6 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <DialogTitle className="text-xl sm:text-2xl">
                        {active.title}
                        {active.featured && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary align-middle">
                            <Star className="mr-1 h-3 w-3 fill-primary/60 text-primary" />
                            Featured
                          </span>
                        )}
                      </DialogTitle>
                      <DialogDescription className="mt-1 text-muted-foreground">
                        {active.summary}
                      </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {active.liveUrl && (
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          aria-label="Open live site"
                        >
                          <a
                            href={active.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live
                          </a>
                        </Button>
                      )}
                      {active.repoUrl && (
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          aria-label="Open repository"
                        >
                          <a
                            href={active.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            Repo
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Copy link"
                        onClick={() =>
                          onCopyLink(active.liveUrl || active.repoUrl)
                        }
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="px-6 pt-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="relative">
                      <div
                        className="group relative overflow-hidden rounded-lg border border-border"
                        aria-roledescription="carousel"
                        aria-label="Project screenshots"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                      >
                        {/* Progress indicator while image loads */}
                        {imageLoading && (
                          <div
                            role="status"
                            aria-label="Loading image"
                            className="absolute inset-x-0 top-0 h-0.5 overflow-hidden"
                          >
                            <div className="h-full w-full animate-[shimmer_1.2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(46,211,183,0.6),transparent)] [background-size:200%_100%]"></div>
                          </div>
                        )}
                        <img
                          src={active.images[slide]}
                          alt={`${active.title} screenshot ${slide + 1}`}
                          className={[
                            "h-72 sm:h-80 w-full object-cover transition duration-300",
                            imageLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
                          ].join(" ")}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => setImageLoading(false)}
                        />
                        {/* Controls */}
                        <button
                          type="button"
                          onClick={prevSlide}
                          aria-label="Previous screenshot"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary/70 p-2 text-secondary-foreground shadow-sm backdrop-blur hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={nextSlide}
                          aria-label="Next screenshot"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary/70 p-2 text-secondary-foreground shadow-sm backdrop-blur hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
                          {active.images.map((_, i) => (
                            <span
                              key={i}
                              aria-label={`Go to slide ${i + 1}`}
                              className={[
                                "h-1.5 w-1.5 rounded-full",
                                i === slide ? "bg-primary" : "bg-muted",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {active.tech.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="rounded-lg border border-border bg-card p-4">
                        <h3 className="font-heading text-base font-semibold">
                          Case Study
                        </h3>
                        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
                          <section>
                            <h4 className="mb-1 font-medium text-muted-foreground">
                              Challenge
                            </h4>
                            <p className="text-foreground/90">
                              {active.caseStudy.challenge}
                            </p>
                          </section>
                          <Separator className="bg-border" />
                          <section>
                            <h4 className="mb-1 font-medium text-muted-foreground">
                              Approach
                            </h4>
                            <p className="text-foreground/90">
                              {active.caseStudy.approach}
                            </p>
                          </section>
                          <Separator className="bg-border" />
                          <section>
                            <h4 className="mb-1 font-medium text-muted-foreground">
                              Results
                            </h4>
                            <p className="text-foreground/90">
                              {active.caseStudy.results}
                            </p>
                          </section>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                          <div className="rounded-md bg-secondary/60 p-3">
                            <div className="text-muted-foreground">Role</div>
                            <div className="font-medium text-foreground">
                              {active.role}
                            </div>
                          </div>
                          <div className="rounded-md bg-secondary/60 p-3">
                            <div className="text-muted-foreground">Year</div>
                            <div className="font-medium text-foreground">
                              {active.year}
                            </div>
                          </div>
                          <div className="rounded-md bg-secondary/60 p-3 sm:col-span-1 col-span-2">
                            <div className="text-muted-foreground">Screens</div>
                            <div className="font-medium text-foreground">
                              {active.images.length}
                            </div>
                          </div>
                        </div>

                        {active.kpis && active.kpis.length > 0 && (
                          <>
                            <h4 className="mt-5 font-heading text-sm font-semibold text-foreground">
                              Key metrics
                            </h4>
                            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                              {active.kpis.map((k) => (
                                <div
                                  key={k.label}
                                  className="rounded-md border border-border bg-surface-2 p-3"
                                >
                                  <div className="text-xs text-muted-foreground">
                                    {k.label}
                                  </div>
                                  <div className="text-lg font-semibold text-foreground">
                                    {k.value}
                                  </div>
                                  {k.sublabel && (
                                    <div className="text-xs text-muted-foreground">
                                      {k.sublabel}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {active.liveUrl && (
                            <Button
                              asChild
                              aria-label="Open live project"
                              className="bg-primary text-primary-foreground hover:opacity-90"
                            >
                              <a
                                href={active.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Live
                              </a>
                            </Button>
                          )}
                          {active.repoUrl && (
                            <Button
                              asChild
                              variant="secondary"
                              aria-label="View source code"
                            >
                              <a
                                href={active.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="mr-2 h-4 w-4" />
                                View Code
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            aria-label="Download case study PDF"
                            onClick={onDownloadCaseStudy}
                          >
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Download Case Study
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

function Toolbar(props: {
  query: string;
  setQuery: (v: string) => void;
  sortBy: SortKey;
  setSortBy: (v: SortKey) => void;
  tags: string[];
  selectedTags: Set<string>;
  toggleTag: (t: string) => void;
  clearTags: () => void;
  total: number;
}) {
  const {
    query,
    setQuery,
    sortBy,
    setSortBy,
    tags,
    selectedTags,
    toggleTag,
    clearTags,
    total,
  } = props;

  return (
    <div className="rounded-xl border border-border bg-card/80 p-3 sm:p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, roles..."
              aria-label="Search projects"
              className="pl-9 bg-secondary/40 border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Sort projects"
                  className="bg-secondary/40 text-xs sm:text-sm whitespace-nowrap"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{sortByLabel(sortBy)}</span>
                  <span className="sm:hidden">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("impact")}>
                  Most Impactful
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("featured")}>
                  Featured
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter by tech</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {total} result{total === 1 ? "" : "s"}
          </div>
        </div>

        <div
          className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
          aria-label="Technology filters"
        >
          {tags.map((t) => {
            const active = selectedTags.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={[
                  "whitespace-nowrap rounded-full border px-2.5 sm:px-3 py-1 text-xs font-medium transition shrink-0",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                ].join(" ")}
                aria-pressed={active}
                aria-label={`Filter by ${t}`}
              >
                {t}
              </button>
            );
          })}
          {selectedTags.size > 0 && (
            <button
              onClick={clearTags}
              className="whitespace-nowrap rounded-full border border-transparent bg-destructive/10 px-2.5 sm:px-3 py-1 text-xs font-medium text-foreground transition hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
              aria-label="Clear filters"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: ProjectItem;
  onOpen: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md focus-within:shadow-md"
      role="listitem"
    >
      <div className="relative h-32 sm:h-40 w-full overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
        <img
          src={project.thumbnail}
          alt={`${project.title} thumbnail`}
          className={[
            "h-full w-full object-cover transition duration-300",
            imgLoaded ? "scale-100 blur-0" : "scale-105 blur-sm",
          ].join(" ")}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
        />
        {/* Quick actions on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-2 bg-gradient-to-t from-background/70 via-background/10 to-transparent px-2 sm:px-3 pb-2 sm:pb-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <div className="pointer-events-auto">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:opacity-90 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
              onClick={onOpen}
              aria-label="View details"
            >
              <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              View
            </Button>
          </div>
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
            {project.liveUrl && (
              <IconAction
                href={project.liveUrl}
                label="Open live"
                icon={<ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              />
            )}
            {project.repoUrl && (
              <IconAction
                href={project.repoUrl}
                label="Open repository"
                icon={<Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-heading text-sm sm:text-base font-semibold">
            {project.title}
          </h3>
          {project.featured && (
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-primary" aria-label="Featured" />
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-secondary px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-secondary-foreground"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-secondary/70 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] text-secondary-foreground">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 sm:pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="rounded-md bg-secondary/50 px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-[11px] text-secondary-foreground">
                {project.role}
              </span>
              <span className="text-[10px] sm:text-[11px]">{project.year}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open live"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open repository"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Card hover lift */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-ring/0 transition group-hover:ring-2" />
    </article>
  );
}

function IconAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center rounded-full border border-border bg-secondary/80 p-1.5 sm:p-2 text-secondary-foreground backdrop-blur transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {icon}
    </a>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 py-16 text-center"
      aria-live="polite"
    >
      <Search className="mb-3 h-6 w-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        No projects found. Try adjusting filters or search terms.
      </p>
    </div>
  );
}

function sortByLabel(s: SortKey) {
  switch (s) {
    case "newest":
      return "Newest";
    case "impact":
      return "Most Impactful";
    case "featured":
      return "Featured";
  }
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={props.className}
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M3 21h18" />
    </svg>
  );
}