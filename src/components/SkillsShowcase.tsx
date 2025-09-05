"use client";

import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  BadgeCheck,
  Brain,
  Database,
  Bot,
  TrendingUp,
  Users,
  FileText,
  Zap,
  Search,
  Target,
  Sparkles,
  MonitorSpeaker,
  BookOpen,
  BarChart3,
  Code,
  Globe,
  Layers,
  Settings
} from "lucide-react";

type SkillCategory = "Frontend" | "Backend" | "AI/ML" | "Languages" | "Frameworks" | "Tools";
type SkillBadge = "Expert" | "Primary" | "Familiar";

type Skill = {
  id: string;
  name: string;
  categories: SkillCategory[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  summary: string;
  percent: number; // 0-100
  badge?: SkillBadge;
  notes?: string[];
  keySkill?: boolean;
};

export type SkillsShowcaseProps = {
  className?: string;
  skills?: Skill[];
  defaultSelectedGroups?: SkillCategory[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_SKILLS: Skill[] = [
  // Frontend Skills
  {
    id: "react",
    name: "React",
    categories: ["Frontend", "Frameworks"],
    icon: Code,
    summary: "Component-based UI development with hooks and state management",
    percent: 95,
    badge: "Expert",
    keySkill: true,
    notes: [
      "Advanced React patterns and performance optimization",
      "Custom hooks and context management",
      "Server-side rendering and hydration"
    ]
  },
  {
    id: "nextjs",
    name: "Next.js",
    categories: ["Frontend", "Frameworks"],
    icon: Globe,
    summary: "Full-stack React framework with SSR and API routes",
    percent: 92,
    badge: "Expert",
    keySkill: true,
    notes: [
      "App Router and Server Components",
      "API routes and middleware",
      "Performance optimization and SEO"
    ]
  },
  {
    id: "vue",
    name: "Vue.js",
    categories: ["Frontend", "Frameworks"],
    icon: Layers,
    summary: "Progressive framework for building user interfaces",
    percent: 78,
    badge: "Primary",
    notes: [
      "Vue 3 Composition API",
      "Vuex state management",
      "Component lifecycle and reactivity"
    ]
  },
  {
    id: "javascript",
    name: "JavaScript",
    categories: ["Languages"],
    icon: Code,
    summary: "Modern ES6+ JavaScript for web development",
    percent: 96,
    badge: "Expert",
    keySkill: true,
    notes: [
      "Advanced ES6+ features and async programming",
      "Functional programming patterns",
      "Browser APIs and DOM manipulation"
    ]
  },
  {
    id: "typescript",
    name: "TypeScript",
    categories: ["Languages"],
    icon: FileText,
    summary: "Strongly typed superset of JavaScript",
    percent: 90,
    badge: "Expert",
    keySkill: true,
    notes: [
      "Advanced type system and generics",
      "Type-safe API development",
      "Integration with modern frameworks"
    ]
  },
  
  // Backend Skills
  {
    id: "python",
    name: "Python",
    categories: ["Backend", "Languages", "AI/ML"],
    icon: Bot,
    summary: "Versatile language for backend development and AI",
    percent: 93,
    badge: "Expert",
    keySkill: true,
    notes: [
      "Django and FastAPI for web development",
      "Data science and machine learning libraries",
      "API development and microservices"
    ]
  },
  {
    id: "nodejs",
    name: "Node.js",
    categories: ["Backend", "Frameworks"],
    icon: Settings,
    summary: "Server-side JavaScript runtime environment",
    percent: 87,
    badge: "Primary",
    notes: [
      "Express.js and API development",
      "Real-time applications with Socket.io",
      "Microservices architecture"
    ]
  },
  
  // AI/ML Skills
  {
    id: "ai-model-training",
    name: "AI Model Training",
    categories: ["AI/ML"],
    icon: Brain,
    summary: "LLMs, computer vision, NLP training workflows",
    percent: 95,
    badge: "Expert",
    keySkill: true,
    notes: [
      "Fine-tuning LLMs for domain-specific tasks",
      "Training computer vision models for production",
      "Optimizing training pipelines and hyperparameters"
    ]
  },
  {
    id: "pytorch",
    name: "PyTorch",
    categories: ["AI/ML", "Tools"],
    icon: Bot,
    summary: "Deep learning framework for model development",
    percent: 86,
    badge: "Primary",
    notes: [
      "Custom model architectures",
      "Distributed training setups",
      "Performance optimization techniques"
    ]
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    categories: ["AI/ML", "Tools"],
    icon: Database,
    summary: "ML platform for production deployment",
    percent: 82,
    badge: "Primary",
    notes: [
      "TensorFlow Serving for production",
      "TensorBoard for experiment tracking",
      "TensorFlow Extended (TFX) pipelines"
    ]
  },
  
  // Tools
  {
    id: "git",
    name: "Git",
    categories: ["Tools"],
    icon: Settings,
    summary: "Version control and collaboration",
    percent: 94,
    badge: "Expert",
    notes: [
      "Advanced Git workflows and branching strategies",
      "Code review and collaboration processes",
      "CI/CD integration and automation"
    ]
  },
  {
    id: "docker",
    name: "Docker",
    categories: ["Tools"],
    icon: Layers,
    summary: "Containerization and deployment",
    percent: 83,
    badge: "Primary",
    notes: [
      "Container orchestration with Docker Compose",
      "Multi-stage builds and optimization",
      "Production deployment strategies"
    ]
  }
];

function useDebouncedValue<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return v;
}

function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current || inView) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.2, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, options]);

  return { ref, inView } as const;
}

function CircleProgress({
  value,
  animate,
  size = 28
}: {
  value: number; // 0-100
  animate?: boolean;
  size?: number;
}) {
  const radius = 10;
  const stroke = 2.5;
  const c = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0">
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="var(--color-muted)"
        strokeOpacity="0.6"
        strokeWidth={stroke}
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={animate ? offset : c}
        className={cx(
          "transition-[stroke-dashoffset] duration-1000 ease-out",
          animate ? "delay-300" : ""
        )}
      />
    </svg>
  );
}

const CATEGORY_ORDER: SkillCategory[] = [
  "Frontend",
  "Backend", 
  "AI/ML",
  "Languages",
  "Frameworks",
  "Tools"
];

export default function SkillsShowcase({
  className,
  skills = DEFAULT_SKILLS,
  defaultSelectedGroups
}: SkillsShowcaseProps) {
  const [selected, setSelected] = React.useState<SkillCategory[]>(
    defaultSelectedGroups ?? []
  );
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [visibleSkills, setVisibleSkills] = React.useState(6);

  const onToggleCategory = React.useCallback((cat: SkillCategory) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(cat)) s.delete(cat);
      else s.add(cat);
      return Array.from(s);
    });
  }, []);

  const clearFilters = React.useCallback(() => {
    setSelected([]);
    setQuery("");
  }, []);

  // Memoize filtered skills for performance
  const filtered = React.useMemo(() => {
    const text = debouncedQuery.trim().toLowerCase();
    const hasCat = selected.length > 0;
    
    return skills
      .filter((sk) => {
        // Category filtering (only when using toggles)
        const catOk = !hasCat || sk.categories.some((c) => selected.includes(c));
        
        // Text search
        const textOk = !text || 
          sk.name.toLowerCase().includes(text) ||
          sk.summary.toLowerCase().includes(text) ||
          sk.notes?.some((n) => n.toLowerCase().includes(text));
          
        return catOk && textOk;
      })
      .sort((a, b) => b.percent - a.percent);
  }, [debouncedQuery, selected, skills]);

  const skillsToShow = filtered.slice(0, visibleSkills);

  const onCardToggle = React.useCallback((id: string) => {
    setExpanded((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }, []);

  const expandedHas = React.useCallback((id: string) => expanded.has(id), [expanded]);

  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const { ref: sectionRef, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={cx(
        "w-full max-w-none bg-[var(--background)] overflow-x-hidden",
        "py-8 sm:py-12 lg:py-16",
        className
      )}
      role="region"
      aria-labelledby="skills-heading">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
          <h2
            id="skills-heading"
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-heading font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Technical Skills & Expertise
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
            Full-stack development with AI/ML specialization. 
            Click on cards to see detailed expertise areas and use "Load More" to explore all skills.
          </p>
        </div>

        <div
          ref={toolbarRef}
          className={cx(
            "flex flex-col gap-3 sm:gap-4 lg:gap-5",
            "rounded-xl sm:rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)]",
            "p-2 sm:p-3 lg:p-6 shadow-lg backdrop-blur-sm",
            "transition-all duration-500 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {CATEGORY_ORDER.map((cat, idx) => (
                <Toggle
                  key={cat}
                  pressed={selected.includes(cat)}
                  onPressedChange={() => onToggleCategory(cat)}
                  aria-label={`Filter ${cat}`}
                  className={cx(
                    "h-7 sm:h-8 lg:h-10 rounded-full border border-[var(--border)]",
                    "text-xs sm:text-sm px-2 sm:px-3 lg:px-5 font-medium",
                    "bg-[var(--surface-1)] data-[state=on]:bg-gradient-to-r data-[state=on]:from-accent/20 data-[state=on]:to-accent/10",
                    "hover:bg-[var(--surface-1)]/80 hover:scale-105 active:scale-95",
                    "data-[state=on]:text-[var(--foreground)] data-[state=on]:border-accent/50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    "transition-all duration-200 ease-out whitespace-nowrap",
                    inView ? `animate-in fade-in-50 slide-in-from-bottom-2 duration-300 delay-${idx * 50}` : ""
                  )}>
                  {cat}
                </Toggle>
              ))}
              {(selected.length > 0 || debouncedQuery) && (
                <button
                  onClick={clearFilters}
                  type="button"
                  className={cx(
                    "h-8 sm:h-10 rounded-full border border-[var(--border)]",
                    "text-xs px-3 sm:px-4 font-medium text-muted-foreground",
                    "bg-[var(--surface-1)] hover:bg-destructive/10 hover:text-destructive",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    "transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                  )}
                  aria-label="Clear filters">
                  Clear
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills..."
                aria-label="Search skills"
                className={cx(
                  "h-8 sm:h-10 w-full rounded-full",
                  "bg-[var(--surface-1)] border border-[var(--border)]",
                  "pl-10 pr-4 text-sm",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  "focus-visible:border-accent/50",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-accent to-accent/60" />
              Proficiency Level
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Key expertise areas
            </span>
          </div>
        </div>

        <div
          className={cx(
            "mt-4 sm:mt-6 lg:mt-8",
            "grid gap-2 sm:gap-3 lg:gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
          <TooltipProvider delayDuration={150}>
            {skillsToShow.map((sk, idx) => (
              <SkillCard
                key={sk.id}
                skill={sk}
                expanded={expandedHas(sk.id)}
                onToggle={() => onCardToggle(sk.id)}
                index={idx}
                inView={inView}
              />
            ))}
          </TooltipProvider>
        </div>

        {filtered.length > visibleSkills && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleSkills(prev => prev + 6)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Load More
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div
            className={cx(
              "mt-8 sm:mt-12 rounded-2xl border border-[var(--border)]",
              "bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] p-6 sm:p-10 text-center",
              "shadow-lg backdrop-blur-sm mx-4"
            )}
            role="status"
            aria-live="polite">
            <p className="text-sm sm:text-base text-muted-foreground">
              No skills match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({
  skill,
  expanded,
  onToggle,
  index,
  inView
}: {
  skill: Skill;
  expanded: boolean;
  onToggle: () => void;
  index: number;
  inView: boolean;
}) {
  const Icon = skill.icon;
  const { ref, inView: cardInView } = useInViewOnce<HTMLDivElement>();
  const isKey = Boolean(skill.keySkill || skill.badge === "Expert" || skill.percent >= 85);

  return (
    <div
      ref={ref}
      className={cx(
        "group relative",
        inView ? `animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-${Math.min(index * 100, 800)}` : "opacity-0"
      )}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={expanded}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cx(
          "flex flex-col",
          "rounded-2xl border border-[var(--border)]",
          "bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)]",
          "transition-all duration-300 ease-out",
          "hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:scale-[1.02]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          "active:scale-[0.98]",
          "cursor-pointer"
        )}>
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className={cx(
                "relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center",
                "rounded-xl border border-[var(--border)]",
                "bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)]",
                "shadow-md shrink-0"
              )}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground truncate">{skill.name}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {skill.summary}
                  </p>
                </div>

                {skill.badge && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={cx(
                          "inline-flex shrink-0 items-center gap-1",
                          "rounded-full border border-[var(--border)]",
                          "bg-gradient-to-r px-1.5 sm:px-2.5 py-0.5 sm:py-1",
                          "text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide",
                          skill.badge === "Expert"
                            ? "from-accent/20 to-accent/10 text-accent border-accent/30"
                            : skill.badge === "Primary"
                            ? "from-primary/20 to-primary/10 text-primary border-primary/30"
                            : "from-muted/20 to-muted/10 text-muted-foreground border-muted/30"
                        )}
                        aria-label={`Proficiency: ${skill.badge}`}>
                        <BadgeCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true" />
                        <span className="hidden sm:inline">{skill.badge}</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-xs">
                      <p>
                        {skill.badge === "Expert"
                          ? "Deep expertise with proven track record"
                          : skill.badge === "Primary"
                          ? "Frequently used in production environments"
                          : "Working knowledge and practical experience"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                <Progress
                  value={skill.percent}
                  className={cx(
                    "h-2 sm:h-2.5 w-full rounded-full bg-[var(--muted)]",
                    "[&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-accent/60",
                    "[&>div]:rounded-full [&>div]:transition-all [&>div]:duration-1000"
                  )}
                  aria-label={`${skill.name} proficiency ${skill.percent}%`}
                />

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {isKey && (
                    <CircleProgress value={skill.percent} animate={cardInView} size={20} />
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-8 sm:w-12 shrink-0 text-right text-xs tabular-nums font-semibold text-foreground">
                        {skill.percent}%
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Practical proficiency level
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx(
            "grid transition-all duration-300 ease-out",
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}>
          <div className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-[var(--border)]/50">
              {skill.notes && skill.notes.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {skill.notes.slice(0, 3).map((n, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="mt-1.5 sm:mt-2 inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-gradient-to-r from-accent to-accent/60 shrink-0" />
                      <span className="leading-relaxed">{n}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground mt-3">Click to explore more details about this expertise area.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}