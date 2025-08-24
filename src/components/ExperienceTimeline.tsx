"use client"

import * as React from "react"
import { useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Rocket,
  FileText,
  Save,
  ExternalLink,
  Calendar,
  ChevronRight,
  Code2,
} from "lucide-react"

type EmploymentType = "full-time" | "contract" | "open-source"
type CompanyType = "startup" | "enterprise" | "contract"

type ExperienceItem = {
  id: string
  company: string
  companyType: CompanyType
  role: string
  start: string // ISO date string
  end: string | "present"
  bullets: string[]
  technologies: string[]
  link?: string
  employmentType: EmploymentType
  accent: string // hex or css color string
  highlight?: boolean
}

export interface ExperienceTimelineProps {
  initialFilter?: "all" | EmploymentType
  initialSort?: "newest" | "oldest"
  className?: string
}

const DATA: ExperienceItem[] = [
  {
    id: "os-core-kit",
    company: "Open Source Core Kit",
    companyType: "startup",
    role: "Maintainer & Lead Developer",
    start: "2023-03-01",
    end: "present",
    bullets: [
      "Designed modular UI primitives with accessible defaults and zero-runtime theming.",
      "Established comprehensive test suite; reduced regressions by 40%.",
      "Guided community contributions and code reviews; merged 250+ PRs.",
      "Introduced performance budgets; cut bundle size by 18%.",
    ],
    technologies: ["TypeScript", "Next.js", "Tailwind", "Radix", "Vite"],
    link: "https://github.com/",
    employmentType: "open-source",
    accent: "#64d7c2",
    highlight: true,
  },
  {
    id: "acme-enterprise",
    company: "Acme Enterprise",
    companyType: "enterprise",
    role: "Senior Frontend Engineer",
    start: "2022-04-01",
    end: "2024-06-01",
    bullets: [
      "Led migration to Next.js app router with granular caching and RSC.",
      "Improved Lighthouse performance from 68 to 96 on key flows.",
      "Shipped design system with shadcn/ui primitives; 30+ apps adopted.",
      "Partnered with Design/UX to refine flows; increased conversion 11%.",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Vitest"],
    link: "https://example.com/case-study",
    employmentType: "full-time",
    accent: "#2ed3b7",
    highlight: true,
  },
  {
    id: "nova-startup",
    company: "Nova Labs",
    companyType: "startup",
    role: "Founding Frontend Engineer",
    start: "2021-01-01",
    end: "2022-03-01",
    bullets: [
      "Built MVP dashboard and analytics with charts and real-time updates.",
      "Implemented typed API layer; reduced runtime errors by 35%.",
      "Bootstrapped CI/CD and preview deployments for rapid iteration.",
    ],
    technologies: ["React", "Next.js", "SWR", "Tailwind", "Playwright"],
    employmentType: "full-time",
    accent: "#f0b289",
  },
  {
    id: "freelance-fintech",
    company: "Fintech Co. (Contract)",
    companyType: "contract",
    role: "Frontend Consultant",
    start: "2020-07-01",
    end: "2020-12-01",
    bullets: [
      "Delivered responsive component library and templates in 8 weeks.",
      "Optimized render paths; reduced TTI by 28% on mobile.",
      "Paired with team to level-up TypeScript patterns and accessibility.",
    ],
    technologies: ["React", "TypeScript", "Tailwind", "Storybook"],
    employmentType: "contract",
    accent: "#22c55e",
  },
  {
    id: "oss-cli",
    company: "DevTools CLI",
    companyType: "startup",
    role: "Contributor",
    start: "2019-05-01",
    end: "2021-03-01",
    bullets: [
      "Added plugin system and config DX; 1.6k stars growth.",
      "Built robust docs site with versioned releases.",
      "Improved error reporting and typed logs.",
    ],
    technologies: ["Node.js", "TypeScript", "MDX", "Next.js"],
    link: "https://github.com/",
    employmentType: "open-source",
    accent: "#ef4444",
  },
]

const companyIcon: Record<CompanyType, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    startup: Rocket,
    enterprise: Building2,
    contract: FileText,
  }

const typeIcon: Record<EmploymentType, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    "full-time": Building2,
    contract: FileText,
    "open-source": Code2,
  }

function formatDate(date: string | "present") {
  if (date === "present") return "Present"
  const d = new Date(date)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" })
}

export default function ExperienceTimeline({
  initialFilter = "all",
  initialSort = "newest",
  className,
}: ExperienceTimelineProps) {
  const [filter, setFilter] = useState<"all" | EmploymentType>(initialFilter)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">(initialSort)
  const [savingId, setSavingId] = useState<string | null>(null)

  // Refs for scroll-to on mini-nav
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const filtered = useMemo(() => {
    const base =
      filter === "all"
        ? DATA
        : DATA.filter((d) => d.employmentType === filter)
    const sorted = [...base].sort((a, b) => {
      const aEnd = a.end === "present" ? new Date() : new Date(a.end)
      const bEnd = b.end === "present" ? new Date() : new Date(b.end)
      const diff = bEnd.getTime() - aEnd.getTime()
      return sortOrder === "newest" ? diff : -diff
    })
    return sorted
  }, [filter, sortOrder])

  function handleSaveSnippet(id: string) {
    setSavingId(id)
    setTimeout(() => {
      setSavingId(null)
      toast("Saved to Downloads", {
        description: "PDF snippet exported successfully.",
      })
    }, 900)
  }

  function handleJump(id: string) {
    const el = nodeRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      el.focus({ preventScroll: true })
    }
  }

  return (
    <section
      aria-labelledby="experience-heading"
      className={["relative", className].filter(Boolean).join(" ")}
    >
      <div className="container max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="experience-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Experience
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A concise timeline of roles, projects, and impact.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <span className="sr-only" id="filter-label">
                Filter experience by type
              </span>
              <div
                role="group"
                aria-labelledby="filter-label"
                className="inline-flex items-stretch rounded-md border bg-card"
              >
                {[
                  { key: "all", label: "All" },
                  { key: "full-time", label: "Full-time" },
                  { key: "contract", label: "Contract" },
                  { key: "open-source", label: "Open-source" },
                ].map((opt, idx) => {
                  const active = filter === (opt.key as any)
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(opt.key as any)}
                      className={[
                        "px-3 py-1.5 text-sm outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-ring",
                        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/60",
                        idx === 0 ? "rounded-l-md" : "",
                        idx === 3 ? "rounded-r-md" : "",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>

              <div className="h-5 w-px bg-border" aria-hidden="true" />

              <div className="inline-flex items-center gap-1 rounded-md border bg-card p-0.5">
                <span className="sr-only" id="sort-label">
                  Sort experience
                </span>
                {[
                  { key: "newest", label: "Newest" },
                  { key: "oldest", label: "Oldest" },
                ].map((opt) => {
                  const active = sortOrder === (opt.key as any)
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      aria-labelledby="sort-label"
                      aria-pressed={active}
                      onClick={() => setSortOrder(opt.key as any)}
                      className={[
                        "px-2.5 py-1.5 text-sm outline-none transition-colors rounded-[6px]",
                        "focus-visible:ring-2 focus-visible:ring-ring",
                        active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/60",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </header>

        <div className="relative">
          {/* Center line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block"
          />

          <Accordion type="single" collapsible className="space-y-6">
            {filtered.map((item, idx) => {
              const SideIcon = companyIcon[item.companyType]
              const EmpIcon = typeIcon[item.employmentType]
              const isLeft = idx % 2 === 0
              const nodeId = `exp-${item.id}`

              return (
                <div
                  key={item.id}
                  ref={(el) => (nodeRefs.current[item.id] = el)}
                  tabIndex={-1}
                  aria-labelledby={`${nodeId}-title`}
                  className="outline-none"
                >
                  <div className="relative grid gap-4 md:grid-cols-2 md:gap-8">
                    {/* Dot on the center line */}
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 top-3 hidden -translate-x-1/2 md:block"
                    >
                      <span
                        className="block h-2.5 w-2.5 rounded-full ring-2"
                        style={{ backgroundColor: item.accent, boxShadow: "0 0 0 2px var(--color-background) inset" }}
                      />
                    </div>

                    {/* Spacer for alignment on the opposite column */}
                    <div className={isLeft ? "" : "hidden md:block"} />

                    {/* Card */}
                    <div
                      className={[
                        "relative",
                        "md:col-start-" + (isLeft ? "1" : "2"),
                        isLeft ? "md:pr-10" : "md:pl-10",
                      ].join(" ")}
                    >
                      {/* Accent bar */}
                      <div
                        aria-hidden="true"
                        className={[
                          "absolute top-2 h-[calc(100%-1rem)] w-0.5 rounded-full",
                          isLeft ? "right-3 md:right-0 md:-mr-5" : "left-3 md:left-0 md:-ml-5",
                          "opacity-70",
                        ].join(" ")}
                        style={{ backgroundColor: item.accent }}
                      />
                      <AccordionItem
                        value={item.id}
                        className="overflow-hidden rounded-lg border bg-card shadow-sm transition-[transform,box-shadow] hover:shadow-md focus-within:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <SideIcon
                                className="size-4 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <p className="truncate text-sm text-muted-foreground">
                                {item.company}
                              </p>
                            </div>
                            <h3
                              id={`${nodeId}-title`}
                              className="mt-1 text-base font-semibold"
                            >
                              {item.role}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="size-3.5" aria-hidden="true" />
                                {formatDate(item.start)} — {formatDate(item.end)}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <EmpIcon className="size-3.5" aria-hidden="true" />
                                {item.employmentType.replace("-", " ")}
                              </span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5">
                            {item.link ? (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-md"
                                aria-label="Open project or case study"
                              >
                                <a href={item.link} target="_blank" rel="noreferrer">
                                  <ExternalLink className="size-4" aria-hidden="true" />
                                </a>
                              </Button>
                            ) : null}
                            <Button
                              variant="secondary"
                              size="icon"
                              className="size-8 rounded-md"
                              aria-label={`Save ${item.role} at ${item.company} as PDF snippet`}
                              onClick={() => handleSaveSnippet(item.id)}
                              disabled={savingId === item.id}
                            >
                              <Save
                                className={[
                                  "size-4 transition-transform",
                                  savingId === item.id ? "animate-pulse" : "",
                                ].join(" ")}
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Tech badges */}
                        <div className="px-4 pb-1 sm:px-5">
                          <div className="flex flex-wrap gap-1.5">
                            {item.technologies.map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="rounded-md bg-secondary/70 text-[11px] font-medium"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Accordion trigger + content */}
                        <AccordionTrigger
                          className="group w-full justify-start gap-2 rounded-none px-4 py-2 text-sm text-muted-foreground hover:no-underline sm:px-5"
                          aria-controls={`${nodeId}-content`}
                        >
                          <span
                            className="inline-flex items-center gap-2"
                            style={{ color: "var(--color-muted-foreground)" }}
                          >
                            <ChevronRight
                              className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90"
                              aria-hidden="true"
                            />
                            View responsibilities and outcomes
                          </span>
                        </AccordionTrigger>
                        <AccordionContent
                          id={`${nodeId}-content`}
                          className="overflow-hidden px-4 pb-4 pt-0 text-sm sm:px-5 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
                        >
                          <ul className="mt-2 space-y-2 pl-1">
                            {item.bullets.map((b, i) => (
                              <li key={i} className="relative pl-4 text-foreground/90">
                                <span
                                  aria-hidden="true"
                                  className="absolute left-0 top-2 block h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: item.accent }}
                                />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  </div>
                </div>
              )
            })}
          </Accordion>

          {/* Sticky mini-nav (desktop) */}
          <nav
            aria-label="Highlighted roles"
            className="pointer-events-auto sticky top-28 -mr-6 hidden h-0 justify-end md:flex"
          >
            <ol className="relative -right-6 flex flex-col items-center gap-2">
              {filtered
                .filter((i) => i.highlight)
                .map((i) => (
                  <li key={i.id}>
                    <button
                      type="button"
                      onClick={() => handleJump(i.id)}
                      aria-label={`Jump to ${i.role} at ${i.company}`}
                      className="group relative flex h-4 w-4 items-center justify-center rounded-full outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        aria-hidden="true"
                        className="block h-2.5 w-2.5 rounded-full opacity-90 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: i.accent }}
                      />
                    </button>
                  </li>
                ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}