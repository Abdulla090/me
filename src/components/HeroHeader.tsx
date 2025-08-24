"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from
"@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage } from
"@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from
"@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Bot,
  Zap,
  TrendingUp,
  Database,
  Users,
  ArrowRight,
  Mail,
  Target,
  Briefcase,
  Calendar } from
"lucide-react";

type HeroStats = {
  years: number;
  projects: number;
  models: number;
};

export interface HeroHeaderProps {
  name?: string;
  subtitle?: string;
  bio?: string;
  avatarSrc?: string;
  initials?: string;
  stats?: HeroStats;
  onSubmitContact?: (payload: {
    name: string;
    email: string;
    message: string;
  }) => Promise<void>;
}

const defaultStats: HeroStats = {
  years: 6,
  projects: 150,
  models: 75
};

function useCountUp(target: number, startWhenInView: boolean, duration = 1400) {
  const [value, setValue] = React.useState(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!startWhenInView) return;
    let start: number | null = null;
    const from = 0;
    const to = target;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, startWhenInView, duration]);

  return value;
}

const expertiseList = [
{ name: "AI Model Training", icon: Brain },
{ name: "Machine Learning", icon: Bot },
{ name: "Data Science", icon: Database },
{ name: "AI Strategy", icon: TrendingUp },
{ name: "Team Training", icon: Users },
{ name: "MLOps", icon: Zap }] as
const;

const codeLines = [
"# AI Training Pipeline",
"def train_model(data, config):",
"    model = create_transformer(config)",
"    trainer = Trainer(model, data)",
"    return trainer.train()",
"",
"# Deploy to production",
"model = train_model(dataset, config)"];


export default function HeroHeader({
  name = "Abdulla",
  subtitle = "AI Trainer & Machine Learning Specialist",
  bio = "Specialized in training and deploying AI models across diverse domains. Expert in Front end website, webapp development, and building AI-powered solutions for businesses of all sizes.",
  avatarSrc,
  initials = "AC",
  stats = defaultStats,
  onSubmitContact
}: HeroHeaderProps) {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const previewRef = React.useRef<HTMLDivElement | null>(null);
  const previewInView = useInView(previewRef, { once: true, amount: 0.4 });

  // Typing simulation for code preview
  const [typedLines, setTypedLines] = React.useState<string[]>([""]);
  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    if (!previewInView) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;

    const type = () => {
      setIsTyping(true);
      const currentLine = codeLines[lineIndex] ?? "";
      if (charIndex < currentLine.length) {
        setTypedLines((prev) => {
          const copy = [...prev];
          copy[lineIndex] = (copy[lineIndex] ?? "") + currentLine[charIndex];
          return copy;
        });
        setCharIndex((idx) => idx + 1);
        timer = setTimeout(type, 28 + Math.random() * 35);
      } else {
        setIsTyping(false);
        pauseTimer = setTimeout(() => {
          setTypedLines((prev) => [...prev, ""]);
          setLineIndex((li) => {
            const next = li + 1;
            if (next >= codeLines.length) {
              setTypedLines([""]);
              setCharIndex(0);
              return 0;
            }
            setCharIndex(0);
            return next;
          });
        }, 180);
      }
    };

    if (!isTyping) {
      timer = setTimeout(type, 250);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [previewInView, lineIndex, charIndex, isTyping]);

  const yearsVal = useCountUp(stats.years, isInView, 1200);
  const projectsVal = useCountUp(stats.projects, isInView, 1400);
  const modelsVal = useCountUp(stats.models, isInView, 1300);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleProjectsScroll = React.useCallback(() => {
    const el =
    document.getElementById("projects") ||
    document.querySelector('[data-section="projects"]');
    if (el && "scrollIntoView" in el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      toast.info("Projects section not found on this page.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message: String(fd.get("message") || "").trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setSending(true);
      if (onSubmitContact) {
        await onSubmitContact(payload);
      } else {
        await new Promise((res) => setTimeout(res, 1100));
      }
      toast.success("Thanks! I'll reach out shortly.");
      setDialogOpen(false);
      formRef.current?.reset();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Hero header"
      className="container px-4 sm:px-6 lg:px-8">

      <Card
        className="
          relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 
          border border-border/60 rounded-2xl sm:rounded-3xl lg:rounded-[2rem]
          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_20px_60px_-15px_rgba(0,0,0,0.4)]
          backdrop-blur-sm
        ">

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(1400px_500px_at_10%_10%,rgba(56,189,248,0.08),transparent_70%)]" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_90%_90%,rgba(168,85,247,0.06),transparent_60%)]" />

        
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 p-4 sm:p-8 lg:p-12 xl:p-16 bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col">

            <div className="flex items-center gap-4 sm:gap-6 lg:gap-7">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>

                <Avatar className="size-16 sm:size-20 md:size-24 lg:size-28 xl:size-32 ring-2 ring-border/40 shadow-xl overflow-hidden shrink-0">
                  <AvatarImage
                    src={avatarSrc}
                    alt={`${name} avatar`}
                    className="object-cover" />

                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="min-w-0 flex-1">
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 }}>

                  {name}
                </motion.h1>
                <motion.p
                  className="mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}>

                  {subtitle}
                </motion.p>
              </div>
            </div>

            <motion.p
              className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl leading-relaxed text-foreground/90 !whitespace-pre-line"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}>

              {bio}
            </motion.p>

            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}>

              <Button
                onClick={handleProjectsScroll}
                aria-label="View Projects"
                className="group bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
                         hover:from-primary/90 hover:to-primary/80 hover:scale-105 active:scale-95
                         focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary 
                         transition-all duration-200 shadow-lg hover:shadow-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto">
                View Projects
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    aria-label="Open contact form"
                    className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground 
                             hover:from-secondary/90 hover:to-secondary/80 hover:scale-105 active:scale-95
                             focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary 
                             transition-all duration-200 shadow-md hover:shadow-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto">
                    <Mail className="mr-2 size-4" />
                    Hire Me
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto bg-popover text-popover-foreground border-border/60">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-semibold">Let's Work Together</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      Share your AI project or training needs. I'll respond within 24 hours with insights and next steps.
                    </DialogDescription>
                  </DialogHeader>
                  <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                      <Input id="name" name="name" placeholder="Your name" required
                      className="border-border/60 focus:border-primary/50" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="you@company.com" required
                      className="border-border/60 focus:border-primary/50" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message" className="text-sm font-medium">Project Details</Label>
                      <Textarea id="message" name="message" placeholder="Describe your AI training needs, timeline, and goals..." required rows={4}
                      className="border-border/60 focus:border-primary/50" />
                    </div>
                    <DialogFooter className="mt-2 sm:mt-3">
                      <Button
                        type="submit"
                        disabled={sending}
                        className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
                                 hover:from-primary/90 hover:to-primary/80 hover:scale-105 active:scale-95
                                 transition-all duration-200 w-full">
                        {sending ? "Sending…" : "Send Message"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>

            <TooltipProvider delayDuration={120}>
              <motion.div
                className="mt-8 sm:mt-10 flex flex-wrap gap-2 sm:gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.7 }}>

                {expertiseList.map((tech, idx) => {
                  const Icon = tech.icon;
                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                      transition={{ delay: 0.1 * idx, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="
                              inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl
                              border border-border/60 bg-gradient-to-r from-secondary/60 to-secondary/40 
                              text-secondary-foreground px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-md
                              hover:from-secondary/80 hover:to-secondary/60 transition-all duration-200 
                              cursor-default backdrop-blur-sm
                            "
                            aria-label={tech.name}>

                            <Icon className="size-3 sm:size-4 text-foreground/80 shrink-0" />
                            <span className="truncate font-medium">{tech.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border/60">
                          <p>Specialized in {tech.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>);

                })}
              </motion.div>
            </TooltipProvider>
          </motion.div>

          <motion.div
            ref={previewRef}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 sm:gap-6 lg:gap-8">

            <div
              className="relative rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-surface-1/80 to-surface-2/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] p-0 sm:p-0 lg:p-0 backdrop-blur-sm h-64 sm:h-80 lg:h-96 xl:h-[28rem] overflow-hidden !bg-[url(https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c3e0b31b-4c52-45f2-895c-ef6cc96ed50e/visual-edit-uploads/1755897908086-86cp2iucrtu.jpg)] !bg-cover !bg-center !bg-no-repeat"
              role="region"
              aria-label="Professional portrait">

              <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none ring-1 ring-white/10" />
            </div>
          </motion.div>
        </div>
      </Card>
    </section>);

}

function StatPill({
  icon: Icon,
  label,
  value,
  suffix = "",
  delay = 0,
  inView
}: {icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;label: string;value: number;suffix?: string;delay?: number;inView: boolean;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -3 }}>

      <div
        className="
          inline-flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl
          border border-border/60 bg-gradient-to-r from-secondary/60 to-secondary/40 
          text-secondary-foreground px-3 sm:px-4 py-2 sm:py-3 shadow-lg backdrop-blur-sm
          hover:from-secondary/80 hover:to-secondary/60 transition-all duration-200
        "
        role="status"
        aria-live="polite">

        <Icon className="size-4 sm:size-5 text-foreground/80 shrink-0" />
        <div className="flex flex-col">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
            {value.toLocaleString()}
            {suffix}
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{label}</span>
        </div>
      </div>
    </motion.div>);

}